const express = require('express');
const { protect, organizerOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createEventSchema, updateEventSchema } = require('../validators/eventValidator');
const {
  getEvents, getEventById, createEvent, updateEvent, deleteEvent, getAttendees, getMyEvents
} = require('../controllers/eventController');
const { registerForEvent } = require('../controllers/registrationController');

const router = express.Router();

// Public
router.get('/', getEvents);

// Organizer-only, specific paths before /:id to avoid route collisions
router.get('/mine/list', protect, organizerOnly, getMyEvents);
router.post('/', protect, organizerOnly, validate(createEventSchema), createEvent);

router.get('/:id', getEventById);
router.put('/:id', protect, organizerOnly, validate(updateEventSchema), updateEvent);
router.delete('/:id', protect, organizerOnly, deleteEvent);
router.get('/:id/attendees', protect, organizerOnly, getAttendees);

// Attendee action
router.post('/:id/register', protect, registerForEvent);

module.exports = router;
