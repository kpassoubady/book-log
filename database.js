const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'books.sqlite'));

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

const allowedSortColumns = ['title', 'author', 'rating', 'created_at'];

function listBooks(sortBy = 'created_at') {
  const column = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = column === 'rating' ? 'DESC' : 'ASC';
  const stmt = db.prepare(`SELECT * FROM books ORDER BY ${column} ${order}`);
  return stmt.all();
}

function addBook(title, author, rating, review) {
  const stmt = db.prepare(
    'INSERT INTO books (title, author, rating, review) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(title, author, rating, review || null);
}

function deleteBook(id) {
  const stmt = db.prepare('DELETE FROM books WHERE id = ?');
  return stmt.run(id);
}

module.exports = { listBooks, addBook, deleteBook };
