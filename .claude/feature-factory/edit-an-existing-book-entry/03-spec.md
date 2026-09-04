# Technical Brief: Edit Book Entry Feature

**Feature ID:** edit-an-existing-book-entry  
**Status:** Ready for Review  
**Target:** book-log (Express/EJS/SQLite app)

## 1. Feature Summary and Boundaries

### What We're Building
Add the ability for users to update existing book entries (title, author, rating, review) while preserving the original `created_at` timestamp.

### Success Definition
Users can click an "Edit" button next to any book in the list, modify the book's data in a pre-filled form, and save changes. The updated book appears in the list with corrected data, maintaining its original creation time and sort position.

### What's Included
- `GET /books/:id/edit` route rendering pre-filled edit form
- `POST /books/:id` route handling update submission
- New `views/edit.ejs` template mirroring `add.ejs` structure
- "Edit" button/link added to each book card in list view
- Two new database functions: `getBook(id)` and `updateBook(...)`
- Server-side validation matching add behavior
- 404 handling for non-existent book IDs

### What's Excluded
- Change history or audit log
- Bulk editing (multi-select)
- Editing the `created_at` timestamp itself
- Client-side JavaScript validation (HTML5 attributes only)
- Concurrent edit collision detection (last-write-wins applies)
- Preserving sort preference across redirects (existing limitation)

## 2. Data Model Changes

NONE

The existing schema already supports all required operations:
- `id INTEGER PRIMARY KEY AUTOINCREMENT` - unique identifier for targeting updates
- `title TEXT NOT NULL` - editable
- `author TEXT NOT NULL` - editable
- `rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5)` - editable with bounds enforcement
- `review TEXT` - editable, nullable
- `created_at DATETIME DEFAULT CURRENT_TIMESTAMP` - must NOT be modified during updates

No migrations, no schema changes, no index additions required.

## 3. API/Route Changes

### New Routes

#### `GET /books/:id/edit`
Purpose: Render edit form pre-populated with book data.

Request:
- Method: GET
- Path parameter: `id` (integer, book ID)

Response (success, 200):
- Renders `views/edit.ejs` with book object: `{ id, title, author, rating, review, created_at }`

Response (not found):
- Redirect to `/` (simple and consistent with current app style)

Implementation notes:
- Call `database.getBook(id)` to fetch book
- If `getBook()` returns `undefined`, redirect to `/`

#### `POST /books/:id`
Purpose: Update book entry with validated data.

Request:
- Method: POST
- Path parameter: `id` (integer, book ID)
- Body (urlencoded):
  - `title` (string, required)
  - `author` (string, required)
  - `rating` (string "1" to "5", required)
  - `review` (string, optional)

Response (success, 302):
- Redirects to `/`

Implementation notes:
- Extract `req.body` fields
- Call `database.updateBook(req.params.id, title, author, parseInt(rating, 10), review)`
- Redirect to `/`
- Critical: `updateBook()` SQL must exclude `created_at` from UPDATE statement

### Existing Routes (No Changes)
- `GET /`
- `GET /add`
- `POST /books`
- `POST /books/:id/delete`

## 4. Frontend Changes

### `views/edit.ejs` (New)
Clone `views/add.ejs` and adapt:
- page title: "Edit Book"
- header: "Edit a Book"
- form action: `/books/<%= book.id %>`
- pre-fill title, author, rating, review from `book`
- submit button text: "Update Book"
- keep required attributes for title/author/rating

### `views/index.ejs` (Modify)
Add Edit link/button in each book card near delete:
- `<a href="/books/<%= book.id %>/edit" class="button edit-button">Edit</a>`

### `public/style.css` (Optional)
Add `.book-actions` and `.edit-button` styles if needed for better action layout.

## 5. File-by-File Implementation Plan

### Modify
- `database.js`
  - add `getBook(id)`
  - add `updateBook(id, title, author, rating, review)`
  - export both
- `app.js`
  - import new db functions
  - add GET edit route
  - add POST update route
- `views/index.ejs`
  - add per-book Edit link

### Create
- `views/edit.ejs`

### Optional Modify
- `public/style.css`
  - action row/button styling

## 6. Test Plan Mapped to Acceptance Criteria

- AC1: Edit link opens pre-filled form
- AC2: Valid submit updates book and redirects
- AC3: Required fields enforced (HTML validation parity)
- AC4: Rating bounds 1-5 enforced
- AC5: Non-existent ID gracefully handled (redirect to home)
- AC6: `created_at` remains unchanged
- AC7: Cancel/back navigation leaves data unchanged
- AC8: Sorting behavior remains consistent after edits

Planned file: `tests/e2e/book-log.spec.js` with new edit-flow tests.

## 7. Risks, Edge Cases, and Mitigations

- Risk: accidentally updating `created_at`
  - Mitigation: explicit UPDATE column list excluding `created_at`
- Risk: invalid rating bypass
  - Mitigation: DB constraint already enforces range
- Edge case: missing book ID
  - Mitigation: redirect to `/`
- Edge case: empty review
  - Mitigation: allowed, render fallback text as today

## 8. Rollback and Compatibility Notes

- No schema changes, so rollback is code-only.
- Existing add/list/sort/delete behavior remains unchanged.
- Feature is additive and backward-compatible.

## Anti-Patterns to Avoid

- Do not update `created_at` in UPDATE SQL.
- Do not write SQL in `app.js`.
- Do not build SQL via string concatenation.
- Do not add inline styles in templates.
- Do not refactor unrelated flows.

STATUS: APPROVED
