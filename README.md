# Pastebin Lite – Backend

A lightweight Pastebin-like backend service built using Node.js and Express. It allows users to store text content and generate shareable links with optional expiration based on time or view counts.

---

## 🚀 Live Application
[https://pastebin-backend-5x8f.onrender.com](https://pastebin-backend-5x8f.onrender.com)

---

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas
* **ID Generation:** NanoID
* **Deployment:** Render

---

## 📌 Features
* **Flexible Expiration:**
    * Time-based expiration (TTL in seconds).
    * View-count based expiration.
* **Content Retrieval:** Fetch raw JSON via REST API or view rendered HTML in a browser.
* **Security:** XSS-safe content rendering using HTML escaping.
* **Scalability:** Designed with automated test evaluation in mind.

---

## 📡 API Endpoints

### 1. Health Check
`GET /api/healthz`  
**Response:** `{"ok": true}`

### 2. Create a Paste
`POST /api/pastes`

**Request Body:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `content` | String | **(Required)** The text content to be stored. |
| `ttl_seconds` | Number | (Optional) Expiration time in seconds. |
| `max_views` | Number | (Optional) Maximum number of allowed views. |

**Example Request:**
```json
{
  "content": "Hello World",
  "ttl_seconds": 120,
  "max_views": 5
}

Response (201 Created):

JSON

{
  "id": "AbC123xY",
  "url": "[https://pastebin-backend-5x8f.onrender.com/p/AbC123xY](https://pastebin-backend-5x8f.onrender.com/p/AbC123xY)"
}


3. Fetch Paste (JSON)
GET /api/pastes/:id

Response:

JSON

{
  "content": "Hello World",
  "remaining_views": 4,
  "expires_at": "2026-01-01T12:00:00.000Z"
}

Note: Returns 404 Not Found if the paste is expired, reached max views, or doesn't exist.
4. View Paste (HTML)
GET /p/:id

Displays paste content safely rendered inside an HTML <pre> block.

⚙️ Environment Variables
To run this project locally, create a .env file in the root directory:
PORT=8080
MONGO_URI=<Your MongoDB Atlas Connection String>
BASE_URL=http://localhost:8080
TEST_MODE=0

🧪 Installation & Testing
Clone the repository:
git clone <your-repo-link>
cd pastebin-lite-backend

Install dependencies:
npm install
Start the server:
npm start

🔐 Security
XSS Prevention: User content is HTML-escaped before rendering to prevent malicious script injection.
Validation: Basic validation on input fields to ensure ttl_seconds and max_views are numbers.

👨‍💻 Author
Rishabh Pandey