const db = require("../../database/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User } = require("../../../models");

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });

    return user ? user : null;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByAlias = async (alias) => {
  try {
    const user = await User.findOne({ where: { alias } });

    return user ? user : null;
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

const createUser = async (name, alias, email, password) => {
  try {
    const { dataValues } = await User.create({ name, alias, email, password });

    return dataValues.id;
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
        user_alias, 
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
        user_alias, 
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

const followingUsers = async (myId) => {
  try {
    const sql = `
      SELECT 
        user_id,
        user_name, 
        user_alias, 
        user_profile, 
        (SELECT COUNT(*) FROM follows WHERE to_user_id = ?) AS followers
      FROM users 
      WHERE user_id IN (SELECT to_user_id FROM follows WHERE from_user_id = ?)
    `;

    const [users] = await db.query(sql, [myId, myId]);

    return users;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getUserByEmail,
  getUserId,
  createUser,
  getUserById,
  getUserByAlias,
  followingUsers,
};
