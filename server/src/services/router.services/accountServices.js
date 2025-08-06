const db = require("../../database/db");
const nodemailer = require("nodemailer");
const nanoid = async () => {
  const { nanoid } = await import("nanoid");
  return nanoid(5);
};

const deleteUserAccount = async (userId) => {
  try {
    await db.beginTransaction();

    await db.query(
      "DELETE FROM follows WHERE from_user_id = ? OR to_user_id = ?",
      [userId, userId]
    );
    await db.query("DELETE FROM posts WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM comments WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM likes WHERE user_id = ?", [userId]);
    await db.query("DELETE FROM users WHERE user_id = ?", [userId]);

    await db.commit();

    return { ok: true, message: "Account deleted" };
  } catch (error) {
    await db.rollback();
    throw new Error(error);
  }
};

module.exports = { deleteUserAccount };
