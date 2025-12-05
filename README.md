

<!-- Badges -->
<p align="center">
	<img src="https://img.shields.io/badge/Node.js-18%2B-green" alt="Node.js" />
	<img src="https://img.shields.io/badge/React-18-blue" alt="React" />
	<img src="https://img.shields.io/badge/MySQL-8-orange" alt="MySQL" />
	<img src="https://img.shields.io/badge/Gemini-2.5_Flash-purple" alt="Gemini" />
</p>


# Amazon Listing Optimizer

A full-stack application that takes an Amazon ASIN, fetches the product details directly from the product page, and generates optimized listing content using Google Gemini. The app displays original and optimized content side-by-side and keeps a history of every optimization.

This README explains what the project does, how it is structured, and how to run it locally.

---

## Screenshots

<p align="center">
	<img src="frontend/SS/HOME1.png" alt="Home Input" width="350" />
	<img src="frontend/SS/HOME2.png" alt="CompareView" width="350" />
	<img src="frontend/SS/HISTORY.png" alt="History Page" width="350" />
</p>

---



## Features

- Fetches Amazon product data using a custom scraper (title, bullet points, description, image).
- Uses Gemini 2.5 Flash to generate improved titles, bullets, descriptions, and keyword suggestions.
- Stores every optimization in a MySQL database.
- Clean React frontend for entering ASINs, comparing results, and viewing history.
- Modern, minimal UI.
- **Ultra-low latency:** Parallelized scraping and AI generation, aggressive HTML caching, background DB writes, strict Gemini response schema, and professional skeleton loaders for instant feedback.

---

## Database & Fallback System

- **Primary Database:** MySQL is used by default, with Sequelize automatically creating the `optimizations` table on startup when valid credentials are present.
- **Full History:** Every listing’s original and optimized data is stored with timestamps, enabling complete history and side-by-side comparisons for each ASIN.
- **Instant Fallback:** If MySQL isn’t configured, the backend switches to a local JSON file (`backend/src/db/db.json`) with the same structure—no setup required.
- **Unified API Shape:** Both database modes share the same API and data format, keeping the frontend consistent and allowing the app to run instantly on any machine.



---

## Tech Stack

### Backend
- Node.js + Express
- Sequelize (MySQL)
- Axios + Cheerio for scraping
- Custom Gemini API client

### Frontend
- React + Vite

---


## Architecture Overview

The system follows a simple client-server flow:
1. User enters an ASIN in the frontend.
2. Frontend calls the backend /api/optimize endpoint.
3. Backend scrapes Amazon for title, bullets, description, and image.
4. Gemini generates optimized content.
5. Backend stores all data and returns it to the UI.
6. UI shows a comparison and stores the state for reload.
7. /api/history provides all past optimizations.

---

## System Diagram

```mermaid
flowchart LR
	A[User/Browser] -->|ASIN| B(Frontend React UI)
	B -->|API call| C(Backend Express API)
	C -->|Scrape| D[Amazon Product Page]
	C -->|AI Request| E[Gemini API]
	C -->|DB Write/Read| F[(MySQL/JSON DB)]
	C -->|Response| B
	B -->|Show Results| A
```

---

## Why This Project Matters
This project demonstrates practical skills used in e-commerce automation: structured scraping, AI-based content generation, secure API design, data persistence, and clean UI workflows. It simulates a simplified version of internal tools used by Amazon sellers and retail optimization teams.

---

## Backend Setup

1. Go to the backend folder
	```sh
	cd backend
	```
2. Install dependencies
	```sh
	npm install
	```
3. Create a .env file
	```sh
	cp .env.example .env
	```
4. Fill in required fields in `.env`:
	```env
	PORT=3000
	GEMINI_API_KEY=your_key_here
	GEMINI_MODEL=gemini-2.5-flash
	DB_HOST=localhost
	DB_USER=your_mysql_user
	DB_PASS=your_mysql_pass
	DB_NAME=listing_optimizer
	```
	If MySQL credentials are valid, the backend will create tables automatically.
5. Start the backend
	```sh
	npm run dev
	```
	Backend will run at:
	http://localhost:3000

---

## Frontend Setup

1. Go to the frontend folder
	```sh
	cd frontend
	```
2. Install dependencies
	```sh
	npm install
	```
3. Start the UI
	```sh
	npm run dev
	```
	Vite will show you a local development URL, usually:
	http://localhost:5173

---


## How to Use the App

1. Open the frontend in the browser.
2. Enter a valid Amazon ASIN.
3. Click Optimize.
4. The UI will show:
	- Original title, bullets, description, and image.
	- Optimized title, bullets, description, and keywords.
5. Visit the History section to view all past optimizations.


---


## API Summary

**POST** `/api/optimize`

Input:
```json
{ "asin": "B0FWDBH2T2" }
```
Returns scraped data + optimized data.

**GET** `/api/history`

Returns all stored optimizations.

**GET** `/api/history/:asin`

Returns optimization history for one ASIN.



---

## Engineering Decisions

 - Used localStorage so users don’t lose results on reload.
 - Scraper has fallback selectors for Amazon layout changes.
 - AI output schema is always the same for the frontend.
 - There’s a JSON fallback DB mode if MySQL isn’t available.
 - Broke out scraper, AI client, and DB helpers into separate modules.
 - Latency optimized: scraping and AI run in parallel, HTML is aggressively cached, DB writes are backgrounded, and the frontend uses animated skeleton loaders for instant feedback.

---

## Limitations

- Amazon changes their HTML often, so scraping can break.
- If you scrape too fast, Amazon might block you.
- Gemini’s output isn’t always consistent; prompt tweaks help but don’t fix everything.

---

<p align="center">
	<b>Made by Aditya Goyal</b><br>
	<a href="mailto:adityism@gmail.com">Contact: adityism@gmail.com</a>
</p>
