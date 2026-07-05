const Joi = require('joi');

const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().min(10).max(2000).required(),
  category: Joi.string().max(40).optional(),
  date: Joi.date().greater('now').required(),
  location: Joi.string().min(2).max(200).required(),
  capacity: Joi.number().integer().min(1).required(),
  coverColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
});

const updateEventSchema = Joi.object({
  title: Joi.string().min(3).max(120).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  category: Joi.string().max(40).optional(),
  date: Joi.date().optional(),
  location: Joi.string().min(2).max(200).optional(),
  capacity: Joi.number().integer().min(1).optional(),
  coverColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
});

module.exports = { createEventSchema, updateEventSchema };
