const db = require("../../database/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const getUserByEmail = async (email) => {
  try {
    const [users] = await db.query("SELECT * FROM users WHERE user_email = ?", [
      email,
    ]);
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserId = async (userID) => {
  try {
    const [user] = await db.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [userID]
    );
    return user.length > 0 ? user[0] : null;
  } catch (error) {
    throw new Error(error);
  }
};

const createUser = async (name, lastname, email, password) => {
  try {
    const userId = crypto.randomUUID();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await db.query(
      "INSERT INTO users (user_name, user_lastname, user_email, user_password, user_id) VALUES (?, ?, ?, ?, ?)",
      [name, lastname, email, hashPassword, userId]
    );

    return userId;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserById = async (myId, userId) => {
  try {
    if (myId == userId) {
      const sql = `
      SELECT 
        user_name, 
        user_lastname, 
        user_profile, 
        (SELECT COUNT(*) FROM follows WHERE to_user_id = ?) AS followers 
      FROM users 
      WHERE user_id = ?
    `;

      const [user] = await db.query(sql, [userId, userId]);
      return user.length > 0 ? user[0] : null;
    } else {
      const sql = `
      SELECT 
        user_name, 
        user_lastname, 
        user_profile, 
        (SELECT COUNT(*) FROM follows WHERE to_user_id = ?) AS followers,
        (SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = ?) AS followed 
      FROM users 
      WHERE user_id = ?
    `;

      const [user] = await db.query(sql, [userId, myId, userId, userId]);
      return user.length > 0 ? user[0] : null;
    }
  } catch (error) {
    throw new Error("Error on getting user by id", error);
  }
};

module.exports = {
  getUserByEmail,
  getUserId,
  createUser,
  getUserById,
};
