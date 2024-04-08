// server.js
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const authRouter = require('./routes/authRouter');
const article = require('./models/article');
const expressLayouts = require('express-ejs-layouts');
const path = require('path'); // Require the path module

mongoose.connect('mongodb://localhost/blog');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', './layout/homelayouts'); // Set the default layout file

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret key
  resave: true,
  saveUninitialized: true,
}));

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', isAuthenticated, async (req, res) => {
  res.render('articles/home', { articles: article });
});

app.get('/index', async(req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles: articles });
});
app.get('/problems', (req, res) => {
  // Render the problems page using EJS
  res.render('articles/problems'); // Specify the correct path
});

// Routes for authentication pages
app.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login', layout: './layout/authlayout' });
});

app.get('/signup', (req, res) => {
  res.render('auth/signup', { title: 'Sign Up', layout: './layout/authlayout' });
});

app.use('/articles', isAuthenticated, articleRouter);
app.use('/', authRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
