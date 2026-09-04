# Backend Builder Summary

## Files Changed
- app.js
- database.js
- tests/unit/database.test.js

## Implemented Backend Contract

### GET /books/:id/edit
- Fetches a book by id using getBook(id).
- Renders edit view with { book } when found.
- Redirects to / when id is not found.

### POST /books/:id
- Accepts form fields: title, author, rating, review.
- Converts rating with parseInt(..., 10).
- Updates with updateBook(id, title, author, rating, review).
- Redirects to / after update.

## Data Layer Additions
- getBook(id): parameterized SELECT by id.
- updateBook(id, title, author, rating, review): parameterized UPDATE that does not modify created_at.

## Validation/Error Behavior
- Follows existing app pattern: HTML required fields + DB constraints.
- Non-existent id on edit GET is handled by redirecting to home.
- No new flash or custom error middleware introduced.

## Caveats
- Sort query is not preserved across post-update redirect (same as existing create/delete behavior).
- Explicit server-side validation/error rendering is still not present in current app pattern.
