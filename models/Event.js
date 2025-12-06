const mongoose = require('mongoose');
const { format } = require('date-fns');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

eventSchema.virtual('formattedDate').get(function() {
  return format(new Date(this.date), 'PPP p');
});

module.exports = mongoose.model('Event', eventSchema);
