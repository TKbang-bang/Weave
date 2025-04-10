const db = require("../../database/db");
const { format } = require("date-fns");
const { getCommentsByPostId } = require("./bigPostsServices");

const createPost = async (title, file, type, userID) => {
  try {
    const postId = crypto.randomUUID();
    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    await db.query(
      "INSERT INTO posts (post_id, post_title, post_media, post_media_type, post_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [postId, title, file, type, date, userID]
    );

    return postId;
  } catch (error) {
    throw new Error(error);
  }
};

const postOwner = async (userId, postID) => {
  const sql = "SELECT post_id FROM posts WHERE post_id = ? AND user_id = ?";
  const [result] = await db.query(sql, [postID, userId]);

  return result.length > 0 ? true : false;
};

const postUpdate = async (title, postID) => {
  const sql = "UPDATE posts SET post_title = ? WHERE post_id = ?";
  await db.query(sql, [title, postID]);
};

const deletePost = async (postId) => {
  try {
    await db.beginTransaction();

    await db.query("DELETE FROM likes WHERE post_id = ?", [postId]);
    await db.query("DELETE FROM comments WHERE post_id = ?", [postId]);
    await db.query("DELETE FROM posts WHERE post_id = ?", [postId]);
    await db.query("DELETE FROM saved WHERE post_id = ?", [postId]);

    await db.commit();

    return { ok: true };
  } catch (error) {
    await db.rollback();
    throw new Error(error);
  }
};

const savePost = async (userId, postId) => {
  try {
    // CHECKING IF THE POST IS ALREADY SAVED
    const [saved] = await db.query(
      "SELECT * FROM saved WHERE user_id = ? AND post_id = ?",
      [userId, postId]
    );

    if (saved.length > 0) {
      await db.query("DELETE FROM saved WHERE user_id = ? AND post_id = ?", [
        userId,
        postId,
      ]);
      return { ok: true, saved: false, message: "Post unsaved successfully" };
    }

    await db.query(
      "INSERT INTO saved (saved_id, user_id, post_id) VALUES (?, ?, ?)",
      [crypto.randomUUID(), userId, postId]
    );

    return { ok: true, saved: true, message: "Post saved successfully" };
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
