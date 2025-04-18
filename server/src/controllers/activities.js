const ServerError = require("../error/errorClass");
const {
  isFollowing,
  followUser,
  unFollowUser,
} = require("../services/router.services/followServices");
const {
  hasLiked,
  unLike,
  like,
} = require("../services/router.services/likesServices");
const {
  postOwner,
  postUpdate,
  deletePost,
  savePost,
} = require("../services/router.services/postServices");

const editTitle = async (req, res, next) => {
  try {
    // POST DATA
    const { title } = req.body;
    const { post_id } = req.params;

    // CHECKING IF THE POST BELONGS TO THE USER
    const isPostOwner = await postOwner(req.session.userID, post_id);

    if (!isPostOwner)
      return next(
        new ServerError(
          "You are not the owner of this post",
          "incorrect user",
          403
        )
      );

    // UPDATING THE POST
    await postUpdate(title, post_id);

    res.json({ ok: true });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const likingPost = async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.body;

    // CHECKING IF THE POST IS ALREADY LIKED
    const liked = await hasLiked(req.session.userID, post_id);

    if (liked) {
      // UNLIKING THE POST
      await unLike(req.session.userID, post_id);
      res.status(200).json({ ok: true, liked: false });
    } else {
      // LIKING THE POST
      await like(req.session.userID, post_id);
      res.status(200).json({ ok: true, liked: true });
    }
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const deletingPost = async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.params;

    // DELETING THE POST
    await deletePost(post_id);

    res.status(201).json({ ok: true, message: "Post deleted" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const following = async (req, res, next) => {
  try {
    // USER ID
    const { user_id } = req.body;

    // CHECKING IF THE USER IS ALREADY FOLLOWING
    const following = await isFollowing(req.session.userID, user_id);

    if (!following) {
      // FOLLOWING THE USER
      await followUser(req.session.userID, user_id);
      res.status(200).json({ ok: true, followed: true });
    } else {
      // UNFOLLOWING THE USER
      await unFollowUser(req.session.userID, user_id);
      res.status(200).json({ ok: true, followed: false });
    }
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const savingPost = async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.body;

    // SAVING THE POST
    const saved = await savePost(req.session.userID, post_id);

    if (!saved)
      return next(new ServerError("Post not saved", "post saving", 500));

    res.status(200).json(saved);
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { editTitle, likingPost, deletingPost, following, savingPost };
