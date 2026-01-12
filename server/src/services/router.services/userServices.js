const { User, sequelize } = require("../../../models");

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
      const user = await User.findByPk(userId, {
        attributes: [
          "name",
          "alias",
          "profile",
          "id",
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Follows" WHERE "Follows"."toUser" = '${userId}')`
            ),
            "followers",
          ],
        ],
      });

      return user ? user : null;
    } else {
      const user = await User.findByPk(userId, {
        attributes: [
          "name",
          "alias",
          "profile",
          "id",
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Follows" WHERE "Follows"."toUser" = '${userId}')`
            ),
            "followers",
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Follows" WHERE "Follows"."fromUser" = '${myId}' AND "Follows"."toUser" = '${userId}')`
            ),
            "following",
          ],
        ],
      });

      return user ? user : null;
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
        (SELECT COUNT(*) FROM "Follows" WHERE toUser = ?) AS followers
      FROM users 
      WHERE userId IN (SELECT toUser FROM "Follows" WHERE fromUser = ?)
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
