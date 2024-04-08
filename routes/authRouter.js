// authRouter.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

// authRouter.js
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    // Successful login
    req.session.isAuthenticated = true;
    res.redirect('/');
  } else {
    // Failed login
    res.redirect('/login');
  }
});


module.exports = router;
