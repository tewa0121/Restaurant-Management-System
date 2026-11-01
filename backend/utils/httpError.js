const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const sendError = (err, res, next) => {
  if (err && err.status) {
    return res.status(err.status).json({ success: false, message: err.message });
  }
  return next(err);
};

module.exports = { httpError, sendError };
