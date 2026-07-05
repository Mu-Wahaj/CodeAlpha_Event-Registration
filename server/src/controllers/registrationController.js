// Handles a user registering for an event, viewing their registrations, and cancelling.
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/email');
const { registrationConfirmationEmail, newRegistrationNotificationEmail } = require('../utils/emailTemplates');

// POST /api/events/:id/register
const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) throw new ApiError(404, 'Event not found');
    if (new Date(event.date) < new Date()) throw new ApiError(400, 'This event has already happened');

    const existing = await Registration.findOne({ user: req.user._id, event: event._id });
    if (existing && existing.status === 'registered') {
      throw new ApiError(409, 'You are already registered for this event');
    }

    const registeredCount = await Registration.countDocuments({ event: event._id, status: 'registered' });
    if (registeredCount >= event.capacity) throw new ApiError(410, 'This event is full');

    let registration;
    if (existing) {
      // Re-registering after a previous cancellation: flip status back
      existing.status = 'registered';
      await existing.save();
      registration = existing;
    } else {
      registration = await Registration.create({ user: req.user._id, event: event._id });
    }

    const populated = await registration.populate('event');
    const newSpotsLeft = event.capacity - (registeredCount + 1);

    sendEmail({
      to: req.user.email,
      subject: `You're confirmed for ${event.title}`,
      html: registrationConfirmationEmail({
        attendeeName: req.user.name,
        eventTitle: event.title,
        date: event.date,
        location: event.location
      })
    });

    if (event.organizer?.email) {
      sendEmail({
        to: event.organizer.email,
        subject: `New registration for ${event.title}`,
        html: newRegistrationNotificationEmail({
          organizerName: event.organizer.name,
          eventTitle: event.title,
          attendeeName: req.user.name,
          attendeeEmail: req.user.email,
          spotsLeft: newSpotsLeft
        })
      });
    }

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// GET /api/registrations/me
const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: registrations });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/registrations/:id/cancel
const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({ _id: req.params.id, user: req.user._id });
    if (!registration) throw new ApiError(404, 'Registration not found');
    if (registration.status === 'cancelled') throw new ApiError(400, 'Registration already cancelled');

    registration.status = 'cancelled';
    await registration.save();
    res.json({ success: true, data: registration });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration };
