const ServerError = require("../error/errorClass");
const {
  getUserPosts,
  getCommentsByPostId,
} = require("../services/router.services/bigPostsServices");
const { createPost } = require("../services/router.services/postServices");

const posting = async (req, res, next) => {
  try {
    // POST DATA
    if (!req.file)
      return next(new ServerError("No file uploaded", "server", 400));

    const { title, type } = req.body;
    const file = req.file.filename;

    // CREATING THE POST
    await createPost(title, file, type, req.session.userID);

    res.status(201).json({ ok: true, message: "Post created" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const gettingMyUserPosts = async (req, res, next) => {
  try {
    // GETTING USER POSTS
    const posts = await getUserPosts(req.session.userID, req.session.userID);
    res.json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const gettingComments = async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.params;

    // GETTING THE COMMENTS
    const comments = await getCommentsByPostId(post_id);
    res.status(200).json({ ok: true, comments });
  } catch (error) {
    return next(new ServerError(error.message, "server", "server", 500));
  }
};

const gettingUserPosts = async (req, res, next) => {
  try {
    // USER ID
    const { user_id } = req.params;

    // GETTING USER POSTS
    const posts = await getUserPosts(req.session.userID, user_id);
    res.status(200).json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = {
  posting,
  gettingMyUserPosts,
  gettingComments,
  gettingUserPosts,
};
