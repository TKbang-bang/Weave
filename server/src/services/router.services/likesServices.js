const db = require("../../database/db");

const hasLiked = async (userId, postId) => {
  const sql = "SELECT COUNT(*) FROM likes WHERE user_id = ? AND post_id = ?";

  const [[result]] = await db.query(sql, [userId, postId]);

  return result["COUNT(*)"] > 0 ? true : false;
};

const unLike = async (userId, postId) => {
  const sql = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
  db.query(sql, [userId, postId]);
};

const like = async (userId, postId) => {
  const sql = "INSERT INTO likes (like_id, user_id, post_id) VALUES (?, ?, ?)";

  db.query(sql, [crypto.randomUUID(), userId, postId]);
};

module.exports = { hasLiked, unLike, like };
