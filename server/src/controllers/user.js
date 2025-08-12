const ServerError = require("../error/errorClass");
const {
  getUserById,
  followingUsers,
} = require("../services/router.services/userServices");

const getUserCredentials = async (req, res, next) => {
  try {
    // GETTING USER
    const user = await getUserById(req.userId, req.userId);
    if (!user) throw new ServerError("User not found", "user", 404);

    res.status(200).json({ user });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const gettingUserById = async (req, res, next) => {
  try {
    // USERID FROM THE URL
    const { user_id } = req.params;

    // GETTING USER
    const user = await getUserById(req.userId, user_id);
    if (!user) throw new ServerError("User not found", "user", 404);

    res.status(200).json({ user });
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
  getUserCredentials,
  gettingUserById,
  gettingFollowingUsers,
};
