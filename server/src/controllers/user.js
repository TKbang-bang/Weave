const ServerError = require("../error/errorClass");
const {
  getUserById,
  followingUsers,
} = require("../services/router.services/userServices");

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

const getUserCredentials = async (req, res, next) => {
  try {
    // GETTING USER
    const user = await getUserById(req.session.userID, req.session.userID);
    if (!user) throw new ServerError("User not found", "user", 404);

    res.status(200).json({ ok: true, user });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const gettingUserById = async (req, res, next) => {
  try {
    // USERID FROM THE URL
    const { user_id } = req.params;

    // GETTING USER
    const user = await getUserById(req.session.userID, user_id);
    if (!user) throw new ServerError("User not found", "user", 404);

    res.status(200).json({ ok: true, user });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const gettingFollowingUsers = async (req, res, next) => {
  try {
    // GETTING FOLLOWING USERS
    const users = await followingUsers(req.session.userID);

    res.status(200).json({ ok: true, users });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

module.exports = {
  getUserId,
  getUserCredentials,
  gettingUserById,
  gettingFollowingUsers,
};
