const { getAllPosts } = require("../services/router.services/bigPostsServices");
const ServerError = require("../error/errorClass");

const getPosts = async (req, res, next) => {
  try {
    // GETTING ALL POSTS
    const posts = await getAllPosts(req.session.userID);

    res.status(200).json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const getFollowingPosts = async (req, res, next) => {
  try {
    // GETTING ALL POSTS
    const posts = await getAllPosts(req.session.userID);

    res.status(200).json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const getPostsById = async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.params;

    // GETTING THE POST
    const post = await getPostById(req.session.userID, post_id);
    // GETTING THE COMMENTS
    const comments = await getCommentsByPostId(post_id);

    if (!post) {
      return next(new ServerError("Post not found", "post", 404));
    }

    // ADDING THE COMMENTS
    post.allComments = comments;
    res.status(200).json({ ok: true, posts: [post] });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { getPosts, getFollowingPosts, getPostsById };
