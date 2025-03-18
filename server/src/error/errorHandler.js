const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    ok: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
