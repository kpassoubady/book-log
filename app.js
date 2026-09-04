const express = require('express');
const path = require('path');
const { listBooks, addBook, deleteBook, getBook, updateBook } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const sortBy = req.query.sort || 'created_at';
  const books = listBooks(sortBy);
  res.render('index', { books, sortBy });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/books', (req, res) => {
  const { title, author, rating, review } = req.body;
  addBook(title, author, parseInt(rating, 10), review);
  res.redirect('/');
});

app.get('/books/:id/edit', (req, res) => {
  const book = getBook(req.params.id);
  if (!book) {
    return res.redirect('/');
  }
  res.render('edit', { book });
});

app.post('/books/:id', (req, res) => {
  const { title, author, rating, review } = req.body;
  updateBook(req.params.id, title, author, parseInt(rating, 10), review);
  res.redirect('/');
});

app.post('/books/:id/delete', (req, res) => {
  deleteBook(req.params.id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Book Log server running on http://localhost:${PORT}`);
});
