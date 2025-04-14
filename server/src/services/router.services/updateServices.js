const db = require("../../database/db");
const bcrypt = require("bcrypt");
const { emialSend } = require("./accountServices");

const changeProfilePicture = async (filename, userID) => {
  try {
    const sql = "UPDATE users SET user_profile = ? WHERE user_id = ?";
    const result = await db.query(sql, [filename, userID]);

    return result[0].affectedRows > 0 ? true : false;
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserName = async (name, password, userId) => {
  try {
    const userPassword = "SELECT user_password FROM users WHERE user_id = ?";

    const [getUserPassword] = await db.query(userPassword, [userId]);

    if (getUserPassword.length == 0)
      return { ok: false, message: "User not found", status: 404 };

    const isMatch = await bcrypt.compare(
      password,
      getUserPassword[0].user_password
    );

    if (!isMatch)
      return { ok: false, message: "Incorrect password", status: 400 };

    const sql = "UPDATE users SET user_name = ? WHERE user_id = ?";
    const [result] = await db.query(sql, [name, userId]);

    return result.affectedRows > 0
      ? { ok: true }
      : { ok: false, message: "User may not exist", status: 404 };
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserAlias = async (alias, password, userId) => {
  try {
    // GETTING THE USER PASSWORD
    const userPassword = "SELECT user_password FROM users WHERE user_id = ?";

    const [getUserPassword] = await db.query(userPassword, [userId]);

    if (getUserPassword.length == 0)
      return { ok: false, message: "User not found", status: 404 };

    const isMatch = await bcrypt.compare(
      password,
      getUserPassword[0].user_password
    );

    if (!isMatch)
      return { ok: false, message: "Incorrect password", status: 400 };

    // CHECKING IF THE ALIAS IS ALREADY IN USE
    const sql = "SELECT user_alias FROM users WHERE user_alias = ?";
    const [userAlias] = await db.query(sql, [alias]);

    if (userAlias.length > 0)
      return { ok: false, message: "Alias already in use", status: 400 };

    const sql2 = "UPDATE users SET user_alias = ? WHERE user_id = ?";
    const [result] = await db.query(sql2, [alias, userId]);

    return result.affectedRows > 0
      ? { ok: true }
      : { ok: false, message: "User may not exist", status: 404 };
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserEmail = async (email, password, userId) => {
  try {
    const [user] = await db.query(
      "SELECT user_password FROM users WHERE user_id = ?",
      [userId]
    );

    if (user.length == 0) {
      return { ok: false, message: "User not found", status: 404 };
    }

    const isMatch = await bcrypt.compare(password, user[0].user_password);

    if (!isMatch) {
      return { ok: false, message: "Incorrect password", status: 400 };
    }

    const [userEmail] = await db.query(
      "SELECT user_email FROM users WHERE user_email = ?",
      [email]
    );

    if (userEmail.length > 0) {
      return { ok: false, message: "Email already in use", status: 409 };
    }

    const sendMail = await emialSend(email);

    if (!sendMail.ok) return { ok: false, message: sendMail.message };

    return { ok: true, code: sendMail.code };
  } catch (error) {
    throw new Error(error);
  }
};

const emailUpdate = async (email, userId) => {
  try {
    const sql = "UPDATE users SET user_email = ? WHERE user_id = ?";
    await db.query(sql, [email, userId]);
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserPasswod = async (oldPassword, newPassword, userId) => {
  try {
    const [user] = await db.query(
      "SELECT user_password FROM users WHERE user_id = ?",
      [userId]
    );

    if (user.length == 0) {
      return { ok: false, message: "User not found", status: 404 };
    }

    const isMatch = await bcrypt.compare(oldPassword, user[0].user_password);

    if (!isMatch)
      return { ok: false, message: "Incorrect password", status: 400 };

    if (oldPassword == newPassword)
      return {
        ok: false,
        message: "New password cannot be the same as the old one",
        status: 400,
      };

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, salt);

    const sql = "UPDATE users SET user_password = ? WHERE user_id = ?";
    await db.query(sql, [hashPassword, userId]);

    return { ok: true, message: "Password Updated" };
  } catch (error) {
    throw new Error(error);
  }
};

const sendChangePassCode = async (email) => {
  try {
    const [userEmailCheck] = await db.query(
      "SELECT user_email, user_id FROM users WHERE user_email = ?",
      [email]
    );

    if (userEmailCheck.length == 0)
      return { ok: false, message: "User not found", status: 404 };

    const sendMail = await emialSend(email);

    if (!sendMail.ok)
      return { ok: false, message: "Failed to send email", status: 500 };

    return { ok: true, code: sendMail.code, userId: userEmailCheck[0].user_id };
  } catch (error) {
    throw new Error(error);
  }
};

const changePassCode = async (email, password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const [passwordUpdate] = await db.query(
      "UPDATE users SET user_password = ? WHERE user_email = ?",
      [hashPassword, email]
    );

    if (!passwordUpdate.affectedRows > 0) {
      return { ok: false, message: "User not found", status: 404 };
    }

    return { ok: true };
  } catch (error) {
    throw new Error(error);
  }
};

const profilePictureDelete = async (userId) => {
  try {
    const [deleteUser] = await db.query(
      `UPDATE users
      SET user_profile = NULL
      WHERE user_id = ?`,
      [userId]
    );

    if (!deleteUser.affectedRows > 0)
      return { ok: false, message: "User not found", status: 404 };

    return { ok: true };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = {
  changeProfilePicture,
  changeUserName,
  changeUserEmail,
  emailUpdate,
  changeUserPasswod,
  sendChangePassCode,
  changePassCode,
  profilePictureDelete,
  changeUserAlias,
};
