const { test, expect } = require('@playwright/test');
const Database = require('better-sqlite3');
const path = require('path');

// Clean database before each test for isolation
test.beforeEach(async () => {
  const dbPath = path.join(__dirname, '../../books.sqlite');
  const db = new Database(dbPath);
  db.exec('DELETE FROM books');
  db.close();
});

test('home page renders and shows sorting controls', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Book Log');
  await expect(page.getByRole('heading', { name: 'Book Log', level: 1 })).toBeVisible();
  await expect(page.getByLabel('Sort by:')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add Book' })).toBeVisible();
});

test('add page renders with required form fields', async ({ page }) => {
  await page.goto('/add');

  await expect(page).toHaveTitle('Add Book');
  await expect(page.getByRole('heading', { name: 'Add a Book', level: 1 })).toBeVisible();
  await expect(page.getByLabel('Title')).toBeVisible();
  await expect(page.getByLabel('Author')).toBeVisible();
  await expect(page.getByLabel('Rating')).toBeVisible();
  await expect(page.getByLabel('Review')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Book' })).toBeVisible();
});

// ============================================================================
// Edit Feature Tests - Acceptance Criteria Coverage
// ============================================================================

test('AC1: edit link opens pre-filled form with current book data', async ({ page }) => {
  // Setup: Add a test book
  await page.goto('/add');
  await page.getByLabel('Title').fill('Original Title');
  await page.getByLabel('Author').fill('Original Author');
  await page.getByLabel('Rating').selectOption('4');
  await page.getByLabel('Review').fill('Original review text');
  await page.getByRole('button', { name: 'Add Book' }).click();

  // Wait for redirect to home
  await page.waitForURL('/');
  
  // Click the Edit link for the book we just added
  const editLink = page.getByRole('link', { name: 'Edit' }).first();
  await editLink.click();

  // Verify we're on the edit page
  await expect(page).toHaveTitle('Edit Book');
  await expect(page.getByRole('heading', { name: 'Edit a Book', level: 1 })).toBeVisible();

  // Verify form is pre-filled with existing values
  await expect(page.getByLabel('Title')).toHaveValue('Original Title');
  await expect(page.getByLabel('Author')).toHaveValue('Original Author');
  await expect(page.getByLabel('Rating')).toHaveValue('4');
  await expect(page.getByLabel('Review')).toHaveValue('Original review text');
  
  // Verify Update button is present
  await expect(page.getByRole('button', { name: 'Update Book' })).toBeVisible();
});

test('AC2: valid edit submission updates book and redirects to list', async ({ page }) => {
  // Setup: Add a test book
  await page.goto('/add');
  await page.getByLabel('Title').fill('Before Edit');
  await page.getByLabel('Author').fill('Author A');
  await page.getByLabel('Rating').selectOption('2');
  await page.getByLabel('Review').fill('Before review');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  // Navigate to edit page
  await page.getByRole('link', { name: 'Edit' }).first().click();

  // Edit the book
  await page.getByLabel('Title').fill('After Edit');
  await page.getByLabel('Author').fill('Author B');
  await page.getByLabel('Rating').selectOption('5');
  await page.getByLabel('Review').fill('After review');
  
  // Submit the form
  await page.getByRole('button', { name: 'Update Book' }).click();

  // Verify redirect to home page
  await page.waitForURL('/');
  await expect(page).toHaveTitle('Book Log');

  // Verify updated values are visible
  await expect(page.getByText('After Edit')).toBeVisible();
  await expect(page.getByText('Author B')).toBeVisible();
  await expect(page.getByText('★★★★★')).toBeVisible();
  await expect(page.getByText('After review')).toBeVisible();
  
  // Verify old values are not present
  await expect(page.getByText('Before Edit')).not.toBeVisible();
  await expect(page.getByText('Author A')).not.toBeVisible();
});

test('AC3: required fields enforced with HTML5 validation', async ({ page }) => {
  // Setup: Add a test book
  await page.goto('/add');
  await page.getByLabel('Title').fill('Test Book');
  await page.getByLabel('Author').fill('Test Author');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  // Navigate to edit page
  await page.getByRole('link', { name: 'Edit' }).first().click();

  // Verify required attributes are present for validation
  const titleInput = page.getByLabel('Title');
  const authorInput = page.getByLabel('Author');
  const ratingSelect = page.getByLabel('Rating');
  
  await expect(titleInput).toHaveAttribute('required', '');
  await expect(authorInput).toHaveAttribute('required', '');
  await expect(ratingSelect).toHaveAttribute('required', '');
  
  // Review field should not be required
  const reviewTextarea = page.getByLabel('Review');
  await expect(reviewTextarea).not.toHaveAttribute('required');
});

test('AC4: rating bounds enforced by dropdown (1-5 only)', async ({ page }) => {
  // Setup: Add a test book
  await page.goto('/add');
  await page.getByLabel('Title').fill('Test Book');
  await page.getByLabel('Author').fill('Test Author');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  // Navigate to edit page
  await page.getByRole('link', { name: 'Edit' }).first().click();

  // Verify rating dropdown only contains valid options (1-5)
  const ratingSelect = page.getByLabel('Rating');
  const options = await ratingSelect.locator('option').allTextContents();
  
  expect(options).toEqual(['1', '2', '3', '4', '5']);
  expect(options.length).toBe(5);
});

test('AC5: non-existent book ID redirects to home page', async ({ page }) => {
  // Try to edit a book with an ID that doesn't exist
  await page.goto('/books/999999/edit');

  // Should redirect to home page
  await page.waitForURL('/');
  await expect(page).toHaveTitle('Book Log');
  await expect(page.getByRole('heading', { name: 'Book Log', level: 1 })).toBeVisible();
});

test('AC6: created_at timestamp remains unchanged after edit', async ({ page }) => {
  // Note: created_at is not displayed in the UI, so we verify behavior
  // by confirming the book's position in created_at sort order stays consistent
  
  // Setup: Add three books in sequence
  await page.goto('/add');
  await page.getByLabel('Title').fill('First Book');
  await page.getByLabel('Author').fill('Author 1');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  await page.goto('/add');
  await page.getByLabel('Title').fill('Second Book');
  await page.getByLabel('Author').fill('Author 2');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  await page.goto('/add');
  await page.getByLabel('Title').fill('Third Book');
  await page.getByLabel('Author').fill('Author 3');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  // Sort by created_at (oldest first - ASC)
  await page.getByLabel('Sort by:').selectOption('created_at');
  
  // Verify initial order: First, Second, Third (oldest to newest)
  let books = page.locator('.book-card h2');
  await expect(books.nth(0)).toContainText('First Book');
  await expect(books.nth(1)).toContainText('Second Book');
  await expect(books.nth(2)).toContainText('Third Book');

  // Edit the Second Book (middle one) - change title but not creation time
  const secondBookCard = page.locator('.book-card').filter({ hasText: 'Second Book' });
  await secondBookCard.getByRole('link', { name: 'Edit' }).click();
  await page.getByLabel('Title').fill('Modified Second Book');
  await page.getByRole('button', { name: 'Update Book' }).click();
  await page.waitForURL('/');

  // Sort by created_at again
  await page.getByLabel('Sort by:').selectOption('created_at');
  
  // Verify order is STILL: First, Modified Second, Third
  // If created_at was modified, the edited book would move to the end
  books = page.locator('.book-card h2');
  await expect(books.nth(0)).toContainText('First Book');
  await expect(books.nth(1)).toContainText('Modified Second Book');
  await expect(books.nth(2)).toContainText('Third Book');
});

test('AC7: cancel link returns to list without applying changes', async ({ page }) => {
  // Setup: Add a test book
  await page.goto('/add');
  await page.getByLabel('Title').fill('Cancel Test');
  await page.getByLabel('Author').fill('Original Author');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  // Navigate to edit page
  await page.getByRole('link', { name: 'Edit' }).first().click();

  // Make changes but don't submit
  await page.getByLabel('Title').fill('Should Not Save');
  await page.getByLabel('Author').fill('Should Not Save');

  // Click cancel/back link
  await page.getByRole('link', { name: 'Back to List' }).click();

  // Verify we're back on home page
  await page.waitForURL('/');
  
  // Verify original values are still present (changes were not saved)
  const bookCard = page.locator('.book-card').first();
  await expect(bookCard.getByRole('heading', { name: 'Cancel Test' })).toBeVisible();
  await expect(bookCard.locator('.author')).toContainText('Original Author');
  await expect(page.getByText('Should Not Save')).not.toBeVisible();
});

test('AC8: edited book appears in correct sort position after title change', async ({ page }) => {
  // Setup: Add multiple books
  await page.goto('/add');
  await page.getByLabel('Title').fill('Zebra Book');
  await page.getByLabel('Author').fill('Author Z');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  await page.goto('/add');
  await page.getByLabel('Title').fill('Apple Book');
  await page.getByLabel('Author').fill('Author A');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  await page.goto('/add');
  await page.getByLabel('Title').fill('Middle Book');
  await page.getByLabel('Author').fill('Author M');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  // Sort by title
  await page.getByLabel('Sort by:').selectOption('title');
  
  // Verify initial sort order: Apple, Middle, Zebra
  const initialBooks = page.locator('.book-card h2');
  await expect(initialBooks.nth(0)).toContainText('Apple Book');
  await expect(initialBooks.nth(1)).toContainText('Middle Book');
  await expect(initialBooks.nth(2)).toContainText('Zebra Book');

  // Edit Zebra Book to become "Banana Book"
  const zebraCard = page.locator('.book-card').filter({ hasText: 'Zebra Book' });
  await zebraCard.getByRole('link', { name: 'Edit' }).click();
  await page.getByLabel('Title').fill('Banana Book');
  await page.getByRole('button', { name: 'Update Book' }).click();
  await page.waitForURL('/');

  // Sort by title again
  await page.getByLabel('Sort by:').selectOption('title');
  
  // Verify new sort order: Apple, Banana, Middle
  const updatedBooks = page.locator('.book-card h2');
  await expect(updatedBooks.nth(0)).toContainText('Apple Book');
  await expect(updatedBooks.nth(1)).toContainText('Banana Book');
  await expect(updatedBooks.nth(2)).toContainText('Middle Book');
});

test('AC8: edited book appears in correct sort position after rating change', async ({ page }) => {
  // Setup: Add books with different ratings
  await page.goto('/add');
  await page.getByLabel('Title').fill('Book A');
  await page.getByLabel('Author').fill('Author');
  await page.getByLabel('Rating').selectOption('5');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  await page.goto('/add');
  await page.getByLabel('Title').fill('Book B');
  await page.getByLabel('Author').fill('Author');
  await page.getByLabel('Rating').selectOption('2');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  await page.goto('/add');
  await page.getByLabel('Title').fill('Book C');
  await page.getByLabel('Author').fill('Author');
  await page.getByLabel('Rating').selectOption('3');
  await page.getByRole('button', { name: 'Add Book' }).click();
  await page.waitForURL('/');

  // Sort by rating (descending)
  await page.getByLabel('Sort by:').selectOption('rating');
  
  // Verify initial order: 5★, 3★, 2★
  const initialBooks = page.locator('.book-card h2');
  await expect(initialBooks.nth(0)).toContainText('Book A');
  await expect(initialBooks.nth(1)).toContainText('Book C');
  await expect(initialBooks.nth(2)).toContainText('Book B');

  // Edit Book B from 2★ to 4★
  const bookBCard = page.locator('.book-card').filter({ hasText: 'Book B' });
  await bookBCard.getByRole('link', { name: 'Edit' }).click();
  await page.getByLabel('Rating').selectOption('4');
  await page.getByRole('button', { name: 'Update Book' }).click();
  await page.waitForURL('/');

  // Sort by rating again
  await page.getByLabel('Sort by:').selectOption('rating');
  
  // Verify new order: 5★, 4★, 3★
  const updatedBooks = page.locator('.book-card h2');
  await expect(updatedBooks.nth(0)).toContainText('Book A');
  await expect(updatedBooks.nth(1)).toContainText('Book B');
  await expect(updatedBooks.nth(2)).toContainText('Book C');
});
