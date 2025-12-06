const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Register page
router.get('/register', (req, res) => res.render('register'));

// Handle registration
router.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];
  if (!username || !email || !password || !password2) errors.push({ msg: 'Fill all fields' });
  if (password !== password2) errors.push({ msg: 'Passwords do not match' });

  if (errors.length > 0) return res.render('register', { errors, username, email, password, password2 });

  const userExists = await User.findOne({ email });
  if (userExists) {
    errors.push({ msg: 'Email already registered' });
    return res.render('register', { errors, username, email, password, password2 });
  }

  const newUser = new User({ username, email, password });
  await newUser.save();
  req.flash('success_msg', 'You are now registered and can log in');
  res.redirect('/login');
});

// Login page
router.get('/login', (req, res) => res.render('login'));

// Login handle
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

// Vote for community leader
router.post('/vote/:id', ensureAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { $inc: { votes: 1 } });
    res.redirect('/leaders'); // make sure nav link and route match
  } catch (err) {
    console.log(err);
    res.redirect('/leaders');
  }
});


// Leaders page
router.get('/leaders', async (req, res) => {
  const users = await User.find().sort({ votes: -1 });
  res.render('leaders', { users, user: req.user });
});

module.exports = router;
