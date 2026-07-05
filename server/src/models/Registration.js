// Registration model: links a user to an event. Cancelling sets status rather than deleting,
// so history is preserved and the spot is freed up.
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' }
  },
  { timestamps: true }
);

// A user can only have one active registration record per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
