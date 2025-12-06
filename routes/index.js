const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Event = require('../models/Event');

router.get('/', (req, res) => res.render('index'));
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.render('index', { events, user: req.user });
});
router.get('/chat', ensureAuthenticated, (req, res) => res.render('chat'));
router.get('/chat', (req, res) => {
  res.render('chat'); // This renders views/chat.hbs
});


module.exports = router;
