# Pastebin Lite – Backend

A lightweight Pastebin-like backend service built using Node.js and Express.
It allows users to store text content and generate a shareable link with optional expiration based on time or number of views.

## 🚀 Live Demo
https://pastebin-backend-5x8f.onrender.com

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB (Atlas)
- NanoID

## 📌 Features
- Create a paste and get a shareable URL
- Optional expiration:
  - Time-based (TTL in seconds)
  - View-count based
- Fetch paste via API
- View paste in browser (HTML)
- XSS-safe rendering
- Health check endpoint

## 📡 API Endpoints

### Health Check
