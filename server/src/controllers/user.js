const getUserId = (req, res, next) => {
  try {
    // CHECKING IF THE USER IS LOGGED
    if (!req.session.userID) {
      return next(new ServerError("User is not logged", "user auth", 401));
    }

    res.status(200).json({ ok: true, user_id: req.session.userID });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { getUserId };
