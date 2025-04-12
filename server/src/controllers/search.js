const ServerError = require("../error/errorClass");
const {
  usersSearch,
  postsSearch,
} = require("../services/router.services/searchServices");

const userSearching = async (req, res, next) => {
  try {
    // SERACH WORD
    const { search } = req.params;

    // SEARCHING
    const searched = await usersSearch(search, req.session.userID);

    res.status(200).json({ ok: true, users: searched });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const postSearching = async (req, res, next) => {
  try {
    // SERACH WORD
    const { search } = req.params;

    // SEARCHING POSTS
    const { posts } = await postsSearch(req.session.userID, search);
    res.status(200).json({ ok: true, posts });
  } catch (error) {
    console.log(error);
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { userSearching, postSearching };
