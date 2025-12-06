const User = require('../models/User');
const passport = require('passport');

exports.registerPage = (req, res) => res.render('register');

exports.registerUser = async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];
  if (!username || !email || !password || !password2) errors.push({ msg: 'Fill all fields' });
  if (password !== password2) errors.push({ msg: 'Passwords do not match' });

  if (errors.length > 0) return res.render('register', { errors, username, email, password, password2 });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    errors.push({ msg: 'Email already registered' });
    return res.render('register', { errors, username, email, password, password2 });
  }

  const newUser = new User({ username, email, password });
  await newUser.save();
  req.flash('success_msg', 'You are now registered and can log in');
  res.redirect('/users/login');
};

exports.loginPage = (req, res) => res.render('login');

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
};
