const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', eventController.listEvents);
router.get('/add', ensureAuthenticated, eventController.addEventPage);
router.post('/add', ensureAuthenticated, eventController.createEvent);
router.get('/edit/:id', ensureAuthenticated, eventController.editEventPage);
router.post('/edit/:id', ensureAuthenticated, eventController.updateEvent);
router.post('/delete/:id', ensureAuthenticated, eventController.deleteEvent);

module.exports = router;
