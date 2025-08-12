const ServerError = require("../error/errorClass");
const {
  getUserPosts,
  getCommentsByPostId,
} = require("../services/router.services/bigPostsServices");
const { createPost } = require("../services/router.services/postServices");

const posting = async (req, res, next) => {
  try {
    // CHECKING IF A FILE WAS UPLOADED
    if (!req.file)
      return next(new ServerError("No file uploaded", "server", 400));

    // POST DATA
    const { title, type } = req.body;
    // FILE
    const file = req.file.filename;

    // CREATING THE POST
    await createPost(title, file, type, req.userId);

    res.status(201).json({ ok: true, message: "Post created" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const gettingMyUserPosts = async (req, res, next) => {
  try {
    // GETTING USER POSTS
    const posts = await getUserPosts(req.userId, req.userId);
    res.status(200).json(posts);
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
};

const gettingComments = async (req, res, next) => {
  try {
    // POST ID
    const { postId } = req.params;

    // GETTING THE COMMENTS
    const comments = await getCommentsByPostId(postId);
    res.status(200).json({ comments });
  } catch (error) {
    return next(new ServerError(error.message, "server", "server", 500));
  }
};

const gettingUserPosts = async (req, res, next) => {
  try {
    // USER ID
    const { user_id } = req.params;

    // GETTING USER POSTS
    const posts = await getUserPosts(req.userId, user_id);
    res.status(200).json(posts);
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
