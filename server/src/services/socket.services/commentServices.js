const db = require("../../database/db");
const crypto = require("crypto");

async function addComment(data) {
  try {
    const comment_id = crypto.randomUUID();
    const insertQuery =
      "INSERT INTO comments (comment_id, post_id, user_id, comment_content) VALUES (?, ?, ?, ?)";

    await db.query(insertQuery, [
      comment_id,
      data.post_id,
      data.user_id,
      data.comment_content,
    ]);

    const userQuery =
      "SELECT user_name, user_profile FROM users WHERE user_id = ?";
    const [userResult] = await db.query(userQuery, [data.user_id]);

    if (userResult.length === 0) {
      throw new Error("User not found");
    }

    return {
      comment_id,
      comment_content: data.comment_content,
      user_name: userResult[0].user_name,
      user_profile: userResult[0].user_profile,
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Server error");
  }
}

module.exports = { addComment };
