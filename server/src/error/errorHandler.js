const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    ok: false,
    about: err.about,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
