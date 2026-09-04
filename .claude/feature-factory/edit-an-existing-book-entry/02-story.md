# User Story: Edit Book Entry

## Story

**As a** book tracker user  
**I want** to update an existing book entry (title, author, rating, review)  
**so that** I can correct mistakes or revise my review without losing the original creation date.

---

## Scope

### In Scope
- Edit form accessible from the book list
- Update title, author, rating, and review fields
- Preserve original `created_at` timestamp
- Validation of required fields and rating bounds
- Error handling for non-existent book IDs

### Out of Scope
- Bulk editing multiple books at once
- Change history or audit log
- Editing the creation timestamp itself
- Soft delete / restore functionality

---

## Acceptance Criteria

1. **When a user clicks an "Edit" link next to a book in the list**, they are taken to a pre-filled form showing the current title, author, rating, and review.

2. **When a user submits the edit form with valid data**, the book entry is updated and the user is redirected back to the book list with the changes visible.

3. **When a user submits the edit form with a missing title, author, or rating**, the form is re-displayed with a clear error message and previously entered values retained.

4. **When a user submits a rating outside the 1–5 range**, the form rejects the input with an error message.

5. **When a user attempts to edit a book ID that does not exist**, the app responds with a 404 error page or redirects to the list with a "Book not found" message.

6. **After editing a book**, the `created_at` timestamp remains unchanged and matches the original creation time.

7. **When a user cancels editing** (via a "Cancel" link or button), they are returned to the book list without any changes applied.

8. **The edited book's sort order is recalculated** if the title or rating changed, maintaining the existing sort behavior (by title, rating, or most recently added).

---

## Non-Functional Constraints

- **SQL injection protection**: All queries must use parameterized statements.
- **Performance**: Edit form load should complete in <500ms for typical datasets (hundreds of books).
- **Browser compatibility**: Form must work in modern browsers without JavaScript (progressive enhancement).
- **Accessibility**: Form labels and error messages must be screen-reader friendly.

---

## Assumptions & Open Decisions

### Assumptions
- Edit functionality is per-book; no multi-select editing needed.
- The review field is optional (can be blank).
- Users access the edit form from the main list page only (no direct URL bookmark requirement specified).

### Open Questions
- **UI placement**: Should the "Edit" link be inline next to each book title, or in a separate actions column?
- **Concurrent edits**: If the same book is edited in two browser tabs, should last-write-win apply, or is collision detection needed?
- **Validation feedback**: Should client-side HTML5 validation complement server-side checks, or server-side only?

---

STATUS: APPROVED

**Status**: APPROVED  
**Next Agent**: spec-writer
