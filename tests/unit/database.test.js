const assert = require('assert');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create a temporary test database
const testDbPath = path.join(__dirname, 'test-books.sqlite');

// Clean up before tests
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

const db = new Database(testDbPath);

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    review TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Database functions (copied from database.js for isolated testing)
function getBook(id) {
  const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
  return stmt.get(id);
}

function updateBook(id, title, author, rating, review) {
  const stmt = db.prepare(
    'UPDATE books SET title = ?, author = ?, rating = ?, review = ? WHERE id = ?'
  );
  return stmt.run(title, author, rating, review || null, id);
}

function addBook(title, author, rating, review) {
  const stmt = db.prepare(
    'INSERT INTO books (title, author, rating, review) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(title, author, rating, review || null);
}

console.log('Running database unit tests...\n');

// Test 1: getBook returns undefined for non-existent ID
console.log('Test 1: getBook returns undefined for non-existent ID');
const nonExistentBook = getBook(999);
assert.strictEqual(nonExistentBook, undefined, 'Should return undefined for non-existent book');
console.log('✓ Passed\n');

// Test 2: getBook returns book object for existing ID
console.log('Test 2: getBook returns book for existing ID');
const insertResult = addBook('Test Book', 'Test Author', 4, 'Great read');
const bookId = insertResult.lastInsertRowid;
const fetchedBook = getBook(bookId);
assert.ok(fetchedBook, 'Should return a book object');
assert.strictEqual(fetchedBook.title, 'Test Book');
assert.strictEqual(fetchedBook.author, 'Test Author');
assert.strictEqual(fetchedBook.rating, 4);
assert.strictEqual(fetchedBook.review, 'Great read');
assert.ok(fetchedBook.created_at, 'Should have created_at timestamp');
console.log('✓ Passed\n');

// Test 3: updateBook modifies book data
console.log('Test 3: updateBook modifies book data');
const originalCreatedAt = fetchedBook.created_at;
updateBook(bookId, 'Updated Title', 'Updated Author', 5, 'Amazing book');
const updatedBook = getBook(bookId);
assert.strictEqual(updatedBook.title, 'Updated Title');
assert.strictEqual(updatedBook.author, 'Updated Author');
assert.strictEqual(updatedBook.rating, 5);
assert.strictEqual(updatedBook.review, 'Amazing book');
console.log('✓ Passed\n');

// Test 4: updateBook preserves created_at timestamp
console.log('Test 4: updateBook preserves created_at timestamp');
assert.strictEqual(updatedBook.created_at, originalCreatedAt, 'created_at should not change');
console.log('✓ Passed\n');

// Test 5: updateBook handles null review
console.log('Test 5: updateBook handles null/empty review');
updateBook(bookId, 'Title', 'Author', 3, '');
const bookWithEmptyReview = getBook(bookId);
assert.strictEqual(bookWithEmptyReview.review, null, 'Empty review should be stored as null');
console.log('✓ Passed\n');

// Test 6: updateBook returns info about affected rows
console.log('Test 6: updateBook returns info about affected rows');
const updateResult = updateBook(bookId, 'Final Title', 'Final Author', 2, 'OK');
assert.strictEqual(updateResult.changes, 1, 'Should report 1 row changed');
console.log('✓ Passed\n');

// Test 7: updateBook for non-existent ID affects 0 rows
console.log('Test 7: updateBook for non-existent ID affects 0 rows');
const noOpResult = updateBook(9999, 'Ghost', 'Ghost', 1, 'Ghost');
assert.strictEqual(noOpResult.changes, 0, 'Should report 0 rows changed for non-existent ID');
console.log('✓ Passed\n');

// Cleanup
db.close();
fs.unlinkSync(testDbPath);

console.log('All database unit tests passed! ✓');
