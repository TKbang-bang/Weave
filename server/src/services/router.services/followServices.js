const db = require("../../database/db");

const isFollowing = async (fromUser, toUser) => {
  const sql =
    "SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = ?";

  const [[result]] = await db.query(sql, [fromUser, toUser]);

  return result["COUNT(*)"] > 0 ? true : false;
};

const unFollowUser = async (fromUser, toUser) => {
  const sql = "DELETE FROM follows WHERE from_user_id = ? AND to_user_id = ?";
  db.query(sql, [fromUser, toUser]);
};

const followUser = async (fromUser, toUser) => {
  const sql =
    "INSERT INTO follows (follow_id, from_user_id, to_user_id) VALUES (?, ?, ?)";

  db.query(sql, [crypto.randomUUID(), fromUser, toUser]);
};

module.exports = { isFollowing, unFollowUser, followUser };
