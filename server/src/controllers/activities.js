const ServerError = require("../error/errorClass");
const { setFollow } = require("../services/router.services/followServices");
const { liking } = require("../services/router.services/likesServices");
const {
  postOwner,
  postUpdate,
  deletePost,
  savePost,
} = require("../services/router.services/postServices");

const editTitle = async (req, res, next) => {
  try {
    // post data
    const { title } = req.body;
    const { post_id } = req.params;

    // verifiying if the post exists
    const updated = await postUpdate(title, post_id, req.userId);

    if (!updated.ok)
      return next(new ServerError(updated.message, "post", updated.status));

    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return next(new ServerError(error.message, "server", 500));
  }
};

const likingPost = async (req, res, next) => {
  try {
    // post id
    const { post_id } = req.body;

    // liking the post
    const like = await liking(req.userId, post_id);

    return res.status(200).json({ liked: like.liking });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const deletingPost = async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.params;

    // DELETING THE POST
    const deleted = await deletePost(post_id, req.userId);

    if (!deleted.ok)
      return next(new ServerError(deleted.message, "post", deleted.status));

    res.status(204).end();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const following = async (req, res, next) => {
  try {
    // USER ID
    const { userId } = req.body;

    // un/following
    const follow = await setFollow(req.userId, userId);

    res.status(200).json({ followed: follow });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const savingPost = async (req, res, next) => {
  try {
    // post id
    const { postId } = req.body;

    // SAVING THE POST
    const saved = await savePost(req.userId, postId);

    res.status(200).json({ saved });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { editTitle, likingPost, deletingPost, following, savingPost };
