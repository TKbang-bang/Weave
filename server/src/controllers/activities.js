const ServerError = require("../error/errorClass");
const {
  hasLiked,
  unLike,
  like,
} = require("../services/router.services/likesServices");
const {
  postOwner,
  postUpdate,
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

module.exports = { editTitle, likingPost };
