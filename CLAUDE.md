# Project Overview
`book-log` is a lightweight Express web app for tracking books you have read. Each entry stores title, author, rating, and a short review. Data is persisted in SQLite using `better-sqlite3`.

## Tech Stack
- Node.js + Express
- EJS templates
- better-sqlite3
- vanilla CSS

## Directory Layout
- `app.js` – Express server and route handlers
- `database.js` – SQLite schema and data access helpers
- `views/` – EJS templates
- `public/` – static CSS
- `llm-context/` – LLM-agent context

## Verification Steps
1. `npm install`
2. `npm start`
3. Open `http://localhost:3000` and add, view, and delete book entries.

## Content Guidelines
- Keep route handlers thin; SQL queries should be parameterized.
- Use a separate stylesheet instead of inline CSS.
- Support sorting the book list by title, rating, or most recently added.
