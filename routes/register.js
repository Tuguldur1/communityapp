const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) errors.push({ msg: 'Please fill all fields' });
  if (password !== password2) errors.push({ msg: 'Passwords do not match' });

  if (errors.length > 0) {
    res.render('register', { errors, username, email, password, password2 });
  } else {
    const userExists = await User.findOne({ email });
    if (userExists) {
      errors.push({ msg: 'Email already registered' });
      return res.render('register', { errors, username, email, password, password2 });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  }
});

module.exports = router;
