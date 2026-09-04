# Feature Factory candidates for Book Log

These feature ideas are good fits for the /feature-factory workflow because they are user-visible, scoped enough for a single implementation pass, and map well to the existing Express/EJS/SQLite app.

## Recommended feature candidates

1. Edit an existing book entry
   - Let users update title, author, rating, and review after creation.
   - Add a dedicated edit form and preserve the existing creation timestamp.

2. Search and filter the book list
   - Support searching by title, author, or review text.
   - Add filters for minimum rating or completed status.

3. Add reading status and progress
   - Track states such as Want to Read, Reading, and Completed.
   - Optionally capture started and finished dates.

4. Add tags or genres
   - Group books by genre, mood, or custom tags.
   - Make tags filterable from the main list.

5. Add reading goals and simple stats
   - Show yearly goals, books read this year, and average rating.
   - Highlight progress toward a target.

6. Import and export library data
   - Import books from CSV or JSON and export the current library.
   - Keep the format simple and easy to use.

7. Mark favorites or create a wishlist
   - Separate favorites from completed books.
   - Add a lightweight wishlist flow for books to read later.

8. Add a dark mode toggle
   - Provide a simple theme switch that persists for the current browser.
   - Keep the styling consistent with the existing app.

9. Add a dedicated book detail page
   - Open a full page for each book with review text and metadata.
   - Keep the list page focused on browsing and sorting.

10. Improve list pagination and empty states
- Break long libraries into pages and add clearer empty-state messages.
- Improve the experience for both small and large collections.

## Suggested implementation order

1. Edit an existing book entry
2. Search and filter the book list
3. Reading status and progress
4. Tags or genres
5. Import and export data

## Why these fit feature-factory well

- Backend work maps naturally to route handlers, database changes, and validation.
- Frontend work maps naturally to forms, list updates, and styling.
- The existing Playwright setup makes acceptance tests straightforward for each feature.
