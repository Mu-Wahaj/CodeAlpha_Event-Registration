const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational) {
    logger.error(err.stack);
  } else {
    logger.warn(`${statusCode} - ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV !== 'production' && !err.isOperational ? { stack: err.stack } : {})
  });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
