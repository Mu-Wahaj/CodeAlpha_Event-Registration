// Event model: created by an organizer, browsed and registered for by attendees.
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General', trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverColor: { type: String, default: '#E8A33D' } // accent used on the ticket stub in the UI
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });
eventSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Event', eventSchema);
