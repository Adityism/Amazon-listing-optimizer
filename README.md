# Amazon Listing Optimizer

This project provides a full-stack application to optimize Amazon product listings using AI (Gemini) and web scraping. Users can input an ASIN, scrape original product details, generate optimized titles, bullet points, descriptions, and keywords, and view a history of all optimizations.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Demo Mode](#demo-mode)
- [Testing Endpoints](#testing-endpoints)
  - [Backend Health Check](#backend-health-check)
  - [Optimize Listing](#optimize-listing)
  - [History (All)](#history-all)
  - [History (by ASIN)](#history-by-asin)
- [Project Milestones (process.md)](#project-milestones-processmd)
- [Troubleshooting](#troubleshooting)

## Features
- Scrape Amazon product details (title, bullets, description) by ASIN.
- AI-powered optimization of listing content (title, bullets, description) and keyword suggestions using Google Gemini.
- Persistence of original and optimized listings in a MySQL database (with JSON file fallback for development).
- Frontend UI to input ASIN, display comparison of original vs. optimized listings, and view optimization history.
- Responsive and Apple-like minimal design for a clean user experience.
- Robust error handling and graceful degradation (mock AI, cached scraper data).

## Architecture
The application follows a client-server architecture:
- **Backend:** Node.js with Express.js for the API, Sequelize for ORM (MySQL), Axios and Cheerio for web scraping, and a custom AI client for Gemini integration.
- **Frontend:** React.js with Vite for fast development and a modern UI.

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- A MySQL server instance (optional, for full database persistence; otherwise, JSON fallback will be used)
- A Google Gemini API Key (optional, for live AI optimization; otherwise, AI will run in mock mode)

### Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file by copying `.env.example`:
    ```bash
    cp .env.example .env
    ```
4.  Edit the `.env` file and configure the following:
    -   `PORT`: Port for the backend server (e.g., `3000`).
    -   `GEMINI_API_KEY`: Your Google Gemini API Key. If left empty, the AI service will run in mock mode.
    -   `GEMINI_MODEL`: The Gemini model to use (e.g., `gemini-pro`).
    -   `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`: Your MySQL database credentials. If these are not configured, the application will use a JSON file (`backend/src/db/db.json`) for persistence instead of MySQL.
    -   `DEMO_MODE`: Set to `true` to force both AI mock and DB JSON fallback, regardless of other settings. (e.g., `DEMO_MODE=true`)

5.  **Database (MySQL only):** If using MySQL, ensure your MySQL server is running and the database specified in `DB_NAME` exists. The backend will automatically create tables on startup.

### Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

1.  **Start Backend:**
    Open a terminal, navigate to the `backend` directory, and run:
    ```bash
    npm start
    ```
    (For development with hot-reloading, use `npm run dev`)

2.  **Start Frontend:**
    Open another terminal, navigate to the `frontend` directory, and run:
    ```bash
    npm run dev
    ```

3.  Open your web browser and navigate to the address shown by the Vite development server (usually `http://localhost:5173/`).

## Demo Mode

To run the application in a fully offline and mocked mode, which is great for demonstrations without external dependencies or API keys:

1.  In `backend/.env`, set `DEMO_MODE=true`.
2.  Ensure `GEMINI_API_KEY` and all `DB_*` variables are either empty or point to invalid services. In demo mode, the application will disregard these and force fallbacks.
3.  Start the backend and frontend as described in [Running the Application](#running-the-application).
    -   You will see console logs confirming "Demo mode activated."
    -   The AI optimization calls will return mock data.
    -   Database operations will persist data to `backend/src/db/db.json`.
    -   Scraping will prefer cached HTML (`backend/src/services/cache/{ASIN}.html`) if available.

## Testing Endpoints

You can test the backend API endpoints using `curl` or a tool like Postman/Insomnia. Ensure the backend server is running (`npm start` in `backend` directory).

### Backend Health Check
```bash
curl http://localhost:3000/api/health
```
**Expected Response (200 OK):**
```json
{"ok":true}
```

### Optimize Listing
```bash
curl -X POST -H "Content-Type: application/json" -d '{"asin": "B0FWDBH2T2"}' http://localhost:3000/api/optimize
```
**Expected Response (200 OK):** (Example with mock AI data if `GEMINI_API_KEY` is not set or `DEMO_MODE=true`)
```json
{
  "id": NUMBER,
  "asin": "B0FWDBH2T2",
  "original": {
    "title": "...",
    "bullets": [...],
    "description": "..."
  },
  "optimized": {
    "title": "Mock Optimized Title...",
    "bullets": ["Mock Bullet 1...", "Mock Bullet 2...", ...],
    "description": "Mock product description...",
    "keywords": ["mock", "test", ...]
  },
  "created_at": "DATETIME_STRING"
}
```

### History (All)
```bash
curl http://localhost:3000/api/history
```
**Expected Response (200 OK):** (An array of optimization records)
```json
[
  {
    "id": NUMBER,
    "asin": "B0FWDBH2T2",
    "original_title": "...",
    "original_bullets": ["...", "..."],
    "original_description": "...",
    "optimized_title": "...",
    "optimized_bullets": ["...", "..."],
    "optimized_description": "...",
    "keywords": ["...", "..."],
    "created_at": "DATETIME_STRING"
  },
  // ... more records
]
```

### History (by ASIN)
```bash
curl http://localhost:3000/api/history/B0FWDBH2T2
```
**Expected Response (200 OK):** (An array of optimization records for the specified ASIN)
```json
[
  {
    "id": NUMBER,
    "asin": "B0FWDBH2T2",
    "original_title": "...",
    "original_bullets": ["...", "..."],
    "original_description": "...",
    "optimized_title": "...",
    "optimized_bullets": ["...", "..."],
    "optimized_description": "...",
    "keywords": ["...", "..."],
    "created_at": "DATETIME_STRING"
  }
]
```

## Project Milestones (process.md)

A detailed account of the project's development, including decisions, implementations, and verifications for each milestone, can be found in `process.md` in the project root.

## Troubleshooting

-   **Backend `AccessDeniedError` for MySQL:** Ensure `DB_USER` and `DB_PASS` in `backend/.env` are correct and the user has privileges to access `DB_NAME` on `DB_HOST`.
-   **Scraping fails:** Amazon frequently updates its website, which can break scrapers. If a live scrape fails, the system attempts to use a cached HTML file for the ASIN (if available in `backend/src/services/cache/`). You can update the cached HTML by running `curl` command (see `process.md` Milestone 4 for details).
-   **AI issues:** If Gemini API calls fail, ensure `GEMINI_API_KEY` in `backend/.env` is valid and has not reached its quota.
-   **`process.env` not loading:** Ensure your `.env` file is in the `backend` directory and `dotenv` is correctly configured (which it is in `backend/config/index.js`).
