# GitHub Copilot Instructions for book-log

## Project Context

book-log is a lightweight Express web app for tracking books you have read.
Each entry stores:
- title
- author
- rating
- short review

Data is persisted in SQLite via `better-sqlite3`.

## Stack and Structure

- Runtime: Node.js
- Web framework: Express
- Templating: EJS
- Database: SQLite with `better-sqlite3`
- Frontend: vanilla CSS

Primary files:
- `app.js`: server setup and route handlers
- `database.js`: schema and data access helpers
- `views/`: EJS templates
- `public/`: static assets (CSS)

## Coding Guidelines

When generating or editing code in this repository:

1. Keep route handlers in `app.js` thin.
2. Place SQL and persistence logic in `database.js`.
3. Always use parameterized SQL queries.
4. Keep styling in files under `public/`; avoid inline CSS in templates.
5. Preserve and support sorting for the book list by:
   - title
   - rating
   - most recently added
6. Follow existing naming and file organization patterns.
7. Prefer small, focused functions over large handlers.

## UI and Template Guidance

- Reuse existing layout and EJS patterns.
- Keep forms and list pages simple and readable.
- Preserve current behavior unless a change is explicitly requested.
- Ensure sorting controls remain intuitive and stable across requests.

## Data and Validation Expectations

- Validate required fields before insert/update operations.
- Treat user input as untrusted.
- Use safe defaults for optional values.
- Return clear, user-friendly error messages in the UI.

## Local Development Workflow

- Install dependencies: `npm install`
- Start the app: `npm start`
- Open: `http://localhost:3000`

Manual verification baseline:
1. Add a book entry.
2. View entries.
3. Delete an entry.
4. Verify sorting by title, rating, and most recently added.

## Change Discipline

- Prefer minimal, targeted edits.
- Do not refactor unrelated code during small tasks.
- Keep backward-compatible behavior for routes and views unless requested otherwise.
- Update `README.md` when behavior or setup changes materially.
