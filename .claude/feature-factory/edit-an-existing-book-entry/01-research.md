# Research Report: Edit Book Entry Feature

## 1. Feature Area Summary

The book-log application currently supports creating, viewing (with sorting), and deleting book entries. The data model includes `id`, `title`, `author`, `rating`, `review`, and `created_at` timestamp. All CRUD operations flow through [app.js](app.js) (route handlers) → [database.js](database.js) (SQL operations) → SQLite database. The add flow uses a dedicated form view ([views/add.ejs](views/add.ejs)) that posts to `/books`, which calls `addBook()` and redirects to home. The home page ([views/index.ejs](views/index.ejs)) displays book cards with delete buttons. No edit capability currently exists.

## 2. Relevant Files

- [app.js](app.js) — Defines all routes; currently has `GET /`, `GET /add`, `POST /books` (create), `POST /books/:id/delete`
- [database.js](database.js) — Exports `listBooks(sortBy)`, `addBook(title, author, rating, review)`, `deleteBook(id)`; defines schema with constraints
- [views/index.ejs](views/index.ejs) — Main list view; displays book cards with title, author, rating, review, delete button; provides sorting dropdown
- [views/add.ejs](views/add.ejs) — Form view for creating books; uses POST to `/books`; has title (text), author (text), rating (select 1-5), review (textarea)
- [public/style.css](public/style.css) — Styling for `.book-form`, `.button`, `.book-card`, `.delete-button`, etc.
- [tests/e2e/book-log.spec.js](tests/e2e/book-log.spec.js) — Playwright E2E tests; currently validates home page and add page rendering
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — Project conventions: keep routes thin, SQL in database.js, parameterized queries, preserve sorting, validate input

## 3. Patterns to Follow

**Routing pattern (app.js):**
- `GET /add` renders the add form
- `POST /books` handles create submission and redirects to `/`
- `POST /books/:id/delete` handles deletion and redirects to `/`
- **For edit:** follow the same pattern: `GET /books/:id/edit` (render form), `POST /books/:id` (update and redirect)

**Data access pattern (database.js):**
- Each operation is a separate exported function
- All SQL uses parameterized queries with `db.prepare(...).run(...)` or `.all()`
- Column whitelisting for dynamic SQL (see `allowedSortColumns`)
- **For edit:** export `getBook(id)` for fetching single book, `updateBook(id, title, author, rating, review)` for update operation

**View pattern (views/):**
- Standalone HTML pages, no shared layout/partials (yet)
- Forms use class `.book-form` for styling
- Required fields use HTML `required` attribute
- Rating is a `<select>` with options 1-5, default 5 selected
- Review is optional (textarea, no `required` attribute)
- Header has app title and a `.button` link for navigation
- **For edit:** create `views/edit.ejs` following `add.ejs` structure, pre-populate form fields with existing book data

**Form submission pattern:**
- POST to `/books` (create) or `/books/:id` (proposed edit)
- `express.urlencoded({ extended: true })` middleware parses body
- `parseInt(rating, 10)` converts rating string to integer
- No explicit error handling in routes (relies on DB constraints + HTML validation)
- Redirect to `/` after successful operation

**Testing pattern (tests/e2e/):**
- Tests verify page renders, title is correct, expected elements are visible
- Use `page.getByRole()`, `page.getByLabel()` for semantic selectors
- No multi-step flow tests yet (e.g., create → edit → verify)
- **For edit:** add tests for edit page rendering, form pre-population, successful update flow

## 4. Similar Features

**Add Book Feature** ([app.js](app.js#L19-L27), [views/add.ejs](views/add.ejs), [database.js](database.js#L23-L29)) is the most similar:
- `GET /add` route renders [views/add.ejs](views/add.ejs)
- Form has 4 fields: `title` (text), `author` (text), `rating` (select), `review` (textarea)
- Form POSTs to `/books` with `method="post"`
- Route handler extracts `req.body`, calls `addBook()`, redirects to `/`
- [database.js](database.js) function uses parameterized INSERT statement

**Edit should mirror this structure:**
- `GET /books/:id/edit` fetches book by ID, renders `views/edit.ejs` with pre-populated data
- Form POSTs to `/books/:id` (or `/books/:id/update` if following delete pattern)
- Route handler extracts `req.body`, calls `updateBook(id, ...)`, redirects to `/`
- [database.js](database.js) adds `getBook(id)` (parameterized SELECT) and `updateBook(id, ...)` (parameterized UPDATE)

## 5. Constraints and Risks

**Database constraints:**
- `rating` must be INTEGER between 1-5 (DB-level CHECK constraint)
- `title`, `author`, `rating` are NOT NULL
- `created_at` has DEFAULT CURRENT_TIMESTAMP — **must NOT be modified during update**

**Data integrity risks:**
- **Timestamp preservation:** UPDATE statement must exclude `created_at` from SET clause
- **Validation:** Current add flow has no explicit server-side validation; relies on HTML `required` + DB constraints. Edit must maintain this pattern or improve it consistently across both add and edit.
- **Non-existent ID:** `GET /books/:id/edit` must handle case where book ID doesn't exist (404 or redirect with error message)
- **Rating bounds:** `parseInt(rating, 10)` could produce values outside 1-5 if HTML select is bypassed; DB constraint will reject, but route will crash without error handling

**Sorting preservation:**
- Home page sorting is controlled by query param `?sort=<column>`
- After update redirect, user loses their sort preference (same issue exists with add/delete)
- Consider preserving sort param in redirect: `res.redirect('/?sort=' + req.query.sort)` (out of scope unless explicitly required)

**Security:**
- SQL injection: already mitigated by parameterized queries (must continue this pattern)
- No authentication/authorization (out of scope for this feature)

**UI/UX:**
- Index page currently shows only delete button; need to add "Edit" button/link next to delete
- Edit button should use `<a href="/books/<%= book.id %>/edit">` (GET) not a form (POST)

## 6. Proposed Implementation Touch Points

**[database.js](database.js):**
- Add `getBook(id)` function — `SELECT * FROM books WHERE id = ?`, return single row or undefined
- Add `updateBook(id, title, author, rating, review)` function — `UPDATE books SET title = ?, author = ?, rating = ?, review = ? WHERE id = ?` (note: excludes `created_at`)
- Export both new functions in `module.exports`

**[app.js](app.js):**
- Add `GET /books/:id/edit` route — call `getBook(req.params.id)`, render `edit.ejs` with book data; handle not-found case
- Add `POST /books/:id` route (or `POST /books/:id/update` if following delete pattern) — extract `req.body`, call `updateBook(req.params.id, ...)`, redirect to `/`

**[views/edit.ejs](views/edit.ejs):**
- Clone structure from [views/add.ejs](views/add.ejs)
- Change page title to "Edit Book"
- Change form action to `/books/<%= book.id %>`
- Pre-populate input values: `value="<%= book.title %>"`, `value="<%= book.author %>"`, `selected` for correct rating, `<%= book.review || '' %>` in textarea
- Change submit button text to "Update Book" or "Save Changes"
- Change header link from "Back to List" to same (keep consistent)

**[views/index.ejs](views/index.ejs):**
- Add "Edit" button/link inside `.book-card`, before or after delete button
- Pattern: `<a href="/books/<%= book.id %>/edit" class="button">Edit</a>`
- Consider styling: may need new CSS class for secondary button style (or reuse `.button`)

**[public/style.css](public/style.css) (optional):**
- Add `.edit-button` or `.secondary-button` class if visual distinction from primary buttons is needed
- Add container styles if edit + delete buttons need layout (e.g., flex row with gap)

**[tests/e2e/book-log.spec.js](tests/e2e/book-log.spec.js):**
- Add test: "edit page renders with form pre-populated" — create a book, navigate to edit, verify form fields contain book data
- Add test: "can update an existing book" — create a book, edit title/rating, submit, verify updated data appears on home page
- Add test: "edit preserves created_at timestamp" — create book, wait, edit book, verify timestamp unchanged (may require exposing timestamp in UI or checking DB directly)
- Consider test: "edit page shows 404 or redirects for non-existent ID"

## 7. CLAUDE.md Rules That Apply

From [.github/copilot-instructions.md](.github/copilot-instructions.md):

> **Coding Guidelines (lines 23-35):**
> 1. Keep route handlers in `app.js` thin.
> 2. Place SQL and persistence logic in `database.js`.
> 3. Always use parameterized SQL queries.
> 4. Keep styling in files under `public/`; avoid inline CSS in templates.
> 5. Preserve and support sorting for the book list by: title, rating, most recently added
> 6. Follow existing naming and file organization patterns.
> 7. Prefer small, focused functions over large handlers.

> **UI and Template Guidance (lines 37-43):**
> - Reuse existing layout and EJS patterns.
> - Keep forms and list pages simple and readable.
> - Preserve current behavior unless a change is explicitly requested.
> - Ensure sorting controls remain intuitive and stable across requests.

> **Data and Validation Expectations (lines 45-50):**
> - Validate required fields before insert/update operations.
> - Treat user input as untrusted.
> - Use safe defaults for optional values.
> - Return clear, user-friendly error messages in the UI.

> **Change Discipline (lines 61-66):**
> - Prefer minimal, targeted edits.
> - Do not refactor unrelated code during small tasks.
> - Keep backward-compatible behavior for routes and views unless requested otherwise.

## 8. Acceptance-Test Considerations

**Manual verification baseline (add to README after implementation):**
1. Add a book entry (existing flow)
2. Click "Edit" button on a book card
3. Verify edit form loads with correct pre-populated data
4. Change title, rating, or review
5. Submit form
6. Verify redirected to home page
7. Verify updated data appears in book card
8. Verify created_at timestamp did NOT change (if timestamp is visible in UI; otherwise verify via DB)
9. Verify sorting still works after edit
10. Delete an entry (existing flow — should still work)

**E2E test coverage needed:**
- Edit page renders and is reachable from home page
- Edit form pre-populates with existing book data
- Can submit edit form and see updated data on home page
- Cannot edit a non-existent book ID (404 or error message)
- Rating validation (1-5) is enforced
- Required fields (title, author, rating) are enforced
- Optional review field can be empty or populated

## 9. Anti-Patterns to Avoid

❌ **DO NOT:**
- Add `created_at` to the UPDATE statement SET clause (would overwrite original timestamp)
- Use string concatenation for SQL queries (always use parameterized queries)
- Add inline CSS to templates (keep in [public/style.css](public/style.css))
- Create a shared layout partial unless explicitly requested (current pattern uses standalone HTML pages)
- Add client-side JavaScript without discussion (app is currently vanilla HTML/CSS)
- Refactor existing add/delete flows while implementing edit (change discipline: minimal edits)
- Skip error handling for non-existent book IDs (must handle gracefully)
- Assume rating is always 1-5 without validation (user could bypass HTML form with curl/Postman)
- Copy-paste validation logic between add and edit routes (consider extracting if duplication becomes significant)

✅ **DO:**
- Follow RESTful-ish conventions: `GET /books/:id/edit`, `POST /books/:id` (or `POST /books/:id/update`)
- Use semantic HTML (labels with `for` attributes, proper input types)
- Test both happy path and error cases (missing book ID, invalid data)
- Maintain consistent button styling and placement with existing UI
- Preserve sorting query param in redirects if feasible (UX improvement, not blocker)
- Add E2E tests before marking feature complete
- Update manual verification steps in README if behavior changes

## 10. Open Questions

1. **Route naming for update:** Should the update endpoint be `POST /books/:id` (REST-style) or `POST /books/:id/update` (matches existing `/books/:id/delete` pattern)? Recommend: `POST /books/:id/update` for consistency with delete pattern.

2. **Error handling for non-existent ID:** Should `GET /books/:id/edit` return 404 page, redirect to home with flash message, or render inline error? Current app has no error UI. Recommend: redirect to home (graceful degradation) or simple error page.

3. **Validation strategy:** Current app relies on HTML `required` + DB constraints. Should edit add explicit server-side validation (e.g., check title/author not empty, rating in 1-5 range) before calling `updateBook()`? Recommend: add minimal validation for consistency, or document as future improvement.

4. **Button placement:** Should "Edit" button appear before or after "Delete" button in book cards? Recommend: Edit before Delete (less destructive action comes first).

5. **Created timestamp visibility:** Currently `created_at` is not shown in UI. Should it be displayed to verify preservation? Recommend: not required for MVP, but helpful for testing.

6. **Form cancel behavior:** Should edit form have a "Cancel" button that links back to home? Recommend: yes, for consistency with "Back to List" link on add page.

---

**Summary for downstream agents:**  
The edit feature is a near-clone of the existing add feature. Core files to touch: [database.js](database.js) (add `getBook` + `updateBook`), [app.js](app.js) (add two routes), [views/edit.ejs](views/edit.ejs) (clone [views/add.ejs](views/add.ejs) with pre-population), [views/index.ejs](views/index.ejs) (add Edit button), [tests/e2e/book-log.spec.js](tests/e2e/book-log.spec.js) (add edit tests). Critical constraint: UPDATE must NOT touch `created_at` column. Follow existing patterns for consistency. Test both happy path and non-existent ID case.
