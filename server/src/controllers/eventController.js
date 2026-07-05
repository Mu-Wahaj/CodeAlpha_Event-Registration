// Handles browsing, creating, editing, and deleting events, plus viewing attendees.
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/email');
const { eventCreatedEmail } = require('../utils/emailTemplates');


// GET /api/events - public list with search, category filter, and pagination
const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, search, category, upcoming } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (upcoming === 'true') query.date = { $gte: new Date() };

    const skip = (Number(page) - 1) * Number(limit);
    const [events, total] = await Promise.all([
      Event.find(query).sort({ date: 1 }).skip(skip).limit(Number(limit)),
      Event.countDocuments(query)
    ]);

    // Attach spotsLeft for each event
    const eventIds = events.map((e) => e._id);
    const counts = await Registration.aggregate([
      { $match: { event: { $in: eventIds }, status: 'registered' } },
      { $group: { _id: '$event', count: { $sum: 1 } } }
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

    const withSpots = events.map((e) => ({
      ...e.toObject(),
      registeredCount: countMap[e._id.toString()] || 0,
      spotsLeft: e.capacity - (countMap[e._id.toString()] || 0)
    }));

    res.json({
      success: true,
      data: withSpots,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id - public event details
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) throw new ApiError(404, 'Event not found');

    const registeredCount = await Registration.countDocuments({ event: event._id, status: 'registered' });

    res.json({
      success: true,
      data: { ...event.toObject(), registeredCount, spotsLeft: event.capacity - registeredCount }
    });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user._id });

    sendEmail({
      to: req.user.email,
      subject: `Your event "${event.title}" is live`,
      html: eventCreatedEmail({
        organizerName: req.user.name,
        eventTitle: event.title,
        date: event.date,
        location: event.location
      })
    });

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// PUT /api/events/:id - organizer edits their own event
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id });
    if (!event) throw new ApiError(404, 'Event not found or not owned by you');

    Object.assign(event, req.body);
    await event.save();
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/events/:id - organizer deletes their own event
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, organizer: req.user._id });
    if (!event) throw new ApiError(404, 'Event not found or not owned by you');
    await Registration.deleteMany({ event: event._id });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id/attendees - organizer views who registered
const getAttendees = async (req, res, next) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id });
    if (!event) throw new ApiError(404, 'Event not found or not owned by you');

    const attendees = await Registration.find({ event: event._id, status: 'registered' })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: attendees });
  } catch (err) {
    next(err);
  }
};

// GET /api/events/mine/list - organizer's own events
const getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ date: 1 });
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getAttendees, getMyEvents };
