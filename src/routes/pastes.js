import express from "express";
import Paste from "../models/paste.js";
import { nanoid } from "nanoid";

const router = express.Router();

/* deterministic time (for tests) */
function getNow(req) {
  if (
    process.env.TEST_MODE === "1" &&
    req.headers["x-test-now-ms"]
  ) {
    return new Date(Number(req.headers["x-test-now-ms"]));
  }
  return new Date();
}

/* CREATE PASTE */
router.post("/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "invalid content" });
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    return res.status(400).json({ error: "invalid ttl_seconds" });
  }

  if (max_views !== undefined && max_views < 1) {
    return res.status(400).json({ error: "invalid max_views" });
  }

  const now = getNow(req);

  const paste = await Paste.create({
    id: nanoid(8),
    content,
    expiresAt: ttl_seconds
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null,
    maxViews: max_views ?? null
  });

  res.status(200).json({
    id: paste.id,
    url: `${process.env.BASE_URL}/p/${paste.id}`
  });
});

/* FETCH PASTE (API) */
router.get("/pastes/:id", async (req, res) => {
  const paste = await Paste.findOne({ id: req.params.id });
  if (!paste) return res.status(404).json({ error: "not found" });

  const now = getNow(req);

  if (paste.expiresAt && paste.expiresAt <= now) {
    return res.status(404).json({ error: "not found" });
  }

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return res.status(404).json({ error: "not found" });
  }

  paste.viewCount += 1;
  await paste.save();

  res.status(200).json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null
        ? null
        : paste.maxViews - paste.viewCount,
    expires_at: paste.expiresAt
      ? paste.expiresAt.toISOString()
      : null
  });
});

/* HTML VIEW */
router.get("/p/:id", async (req, res) => {
  const paste = await Paste.findOne({ id: req.params.id });
  if (!paste) return res.status(404).send("Not Found");

  const now = getNow(req);

  if (paste.expiresAt && paste.expiresAt <= now) {
    return res.status(404).send("Not Found");
  }

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return res.status(404).send("Not Found");
  }

  paste.viewCount += 1;
  await paste.save();

  const escaped = String(paste.content)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  res.send(`
<!DOCTYPE html>
<html>
  <body>
    <pre>${escaped}</pre>
  </body>
</html>
`);
});

export default router;
