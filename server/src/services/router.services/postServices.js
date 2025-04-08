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

    await db.commit();

    return { ok: true };
  } catch (error) {
    await db.rollback();
    throw new Error(error);
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

module.exports = {
  createPost,
  postOwner,
  postUpdate,
  deletePost,
  gettingComments,
};
