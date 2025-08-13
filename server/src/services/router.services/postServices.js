const { Post, Save } = require("../../../models");

const createPost = async (title, file, type, userId) => {
  try {
    const { dataValues } = await Post.create({
      title,
      media: file,
      media_type: type,
      userId,
    });

    return dataValues.id;
  } catch (error) {
    throw new Error(error);
  }
};

const postOwner = async (userId, postID) => {
  const sql = "SELECT post_id FROM posts WHERE post_id = ? AND user_id = ?";
  const [result] = await db.query(sql, [postID, userId]);

  return result.length > 0 ? true : false;
};

const postUpdate = async (title, postId, userId) => {
  try {
    const post = await Post.findOne({
      where: { id: postId },
    });

    // verifiying if the post belongs to the user
    if (!post) return { ok: false, message: "Post not found", status: 404 };
    if (post.userId != userId)
      return {
        ok: false,
        message: "You are not the owner of this post",
        status: 403,
      };

    await post.update({ title });

    return { ok: true };
  } catch (error) {
    throw new Error(error);
  }
};

const deletePost = async (postId, userId) => {
  try {
    // verifiying if the post exists
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) return { ok: false, message: "Post not found", status: 404 };

    // verifiying if the post belongs to the user
    if (post.userId != userId)
      return {
        ok: false,
        message: "You are not the owner of this post",
        status: 403,
      };

    await post.destroy();

    return { ok: true, message: "Post deleted" };
  } catch (error) {
    throw new Error(error);
  }
};

const savePost = async (userId, postId) => {
  try {
    const save = await Save.findOne({
      where: { userId, postId },
    });

    if (save) {
      await save.destroy();
      return false;
    } else {
      await Save.create({
        userId,
        postId,
      });
      return true;
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createPost,
  postOwner,
  postUpdate,
  deletePost,
  savePost,
};
