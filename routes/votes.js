const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');

// Leaders page
router.get('/leaders', async (req, res) => {
  try {
    const users = await User.find().sort({ votes: -1 });
    res.render('leaders', { users, user: req.user });
  } catch (err) {
    console.error(err);
    res.render('leaders', { users: [], user: req.user });
  }
});

// Vote
router.post('/vote/:id', ensureAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { $inc: { votes: 1 } });
    req.flash('success_msg', 'Your vote has been counted!');
    res.redirect('/leaders');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Vote failed');
    res.redirect('/leaders');
  }
});

module.exports = router;
