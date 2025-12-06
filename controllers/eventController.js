const Event = require('../models/Event');

exports.listEvents = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.render('events', { events, user: req.user });
};

exports.addEventPage = (req, res) => res.render('addEvent');

exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const newEvent = new Event({ title, description, date, location, createdBy: req.user._id });
  await newEvent.save();
  req.flash('success_msg', 'Event created successfully');
  res.redirect('/events');
};

exports.editEventPage = async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render('editEvent', { event });
};

exports.updateEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  await Event.findByIdAndUpdate(req.params.id, { title, description, date, location });
  req.flash('success_msg', 'Event updated successfully');
  res.redirect('/events');
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Event deleted');
  res.redirect('/events');
};
