const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
};

const MYSQL_ERRORS = {
  ER_DUP_ENTRY: [409, 'DUPLICATE_ENTRY', 'A record with the same unique value already exists.'],
  ER_NO_REFERENCED_ROW_2: [400, 'INVALID_REFERENCE', 'A referenced record does not exist.'],
  ER_NO_REFERENCED_ROW: [400, 'INVALID_REFERENCE', 'A referenced record does not exist.'],
  ER_ROW_IS_REFERENCED_2: [409, 'IN_USE', 'This record is in use and cannot be deleted.'],
  ER_ROW_IS_REFERENCED: [409, 'IN_USE', 'This record is in use and cannot be deleted.'],
  ER_BAD_NULL_ERROR: [400, 'MISSING_VALUE', 'A required value is missing.'],
  ER_DATA_TOO_LONG: [400, 'VALUE_TOO_LONG', 'One of the values is too long.'],
  ER_TRUNCATED_WRONG_VALUE: [400, 'INVALID_VALUE', 'One of the values has an invalid format.'],
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: [400, 'INVALID_VALUE', 'One of the values has an invalid format.'],
  WARN_DATA_TRUNCATED: [400, 'INVALID_VALUE', 'One of the values is not allowed.'],
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code && typeof err.code === 'string' && err.isOperational ? err.code : null;
  let details = err.details || null;

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body contains invalid JSON.';
    code = 'INVALID_JSON';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large.';
    code = 'PAYLOAD_TOO_LARGE';
  } else if (err.message === 'Origin not allowed by CORS') {
    statusCode = 403;
    code = 'CORS_BLOCKED';
  } else if (!err.isOperational && MYSQL_ERRORS[err.code]) {
    [statusCode, code, message] = MYSQL_ERRORS[err.code];
  } else if (!err.isOperational) {
    statusCode = 500;
    code = 'INTERNAL_ERROR';
    console.error('Unhandled error:', err);
    if (process.env.NODE_ENV === 'production') message = 'Internal Server Error';
  }

  const body = { success: false, status: statusCode, message };
  if (code) body.code = code;
  if (details) body.errors = details;
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) body.stack = err.stack;

  res.status(statusCode).json(body);
};

module.exports = { notFound, errorHandler };