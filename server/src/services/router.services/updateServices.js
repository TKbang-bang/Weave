const db = require("../../database/db");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");

const changeProfilePicture = async (filename, userID) => {
  try {
    const sql = "UPDATE users SET user_profile = ? WHERE user_id = ?";
    const result = await db.query(sql, [filename, userID]);

    return result.affectedRows > 0 ? true : false;
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserName = async (name, lastname, password, userId) => {
  try {
    const userPassword = "SELECT user_password FROM users WHERE user_id = ?";

    const [getUserPassword] = await db.query(userPassword, [userId]);

    if (getUserPassword.length == 0)
      return { ok: false, message: "User not found" };

    const isMatch = await bcrypt.compare(
      password,
      getUserPassword[0].user_password
    );

    if (!isMatch) return { ok: false, message: "Incorrect password" };

    const sql =
      "UPDATE users SET user_name = ?, user_lastname = ? WHERE user_id = ?";
    const [result] = await db.query(sql, [name, lastname, userId]);

    return result.affectedRows > 0
      ? { ok: true }
      : { ok: false, message: "User may not exist" };
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
      return { ok: false, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(password, user[0].user_password);

    if (!isMatch) {
      return { ok: false, message: "Incorrect password" };
    }

    const [userEmail] = await db.query(
      "SELECT user_email FROM users WHERE user_email = ?",
      [email]
    );

    if (userEmail.length > 0) {
      return { ok: false, message: "Email already in use" };
    }

    const code = nanoid(5);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verification code",
      html: `<div>
              <p>Verification code</p>
              <h1>${code}</h1>
            </div>`,
    };

    await transporter.sendMail(mailOptions);

    return { ok: true, code };
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
      return { ok: false, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(oldPassword, user[0].user_password);

    if (!isMatch) {
      return { ok: false, message: "Incorrect password" };
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(newPassword, salt);

      const sql = "UPDATE users SET user_password = ? WHERE user_id = ?";
      await db.query(sql, [hashPassword, userId]);

      return { ok: true, message: "Password Updated" };
    }
  } catch (error) {
    throw new Error(error);
  }
};

const sendChangePassCode = async (email) => {
  try {
    const [userEmailCheck] = await db.query(
      "SELECT user_email FROM users WHERE user_email = ?",
      [email]
    );

    if (userEmailCheck.length == 0)
      return { ok: false, message: "User not found" };

    const code = nanoid(5);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verification code",
      html: `<div>
        <p>Verification code</p>
        <h1>${code}</h1>
        </div>`,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!info.accepted) {
      return { ok: false, message: "Failed to send email" };
    }

    return { ok: true, code };
  } catch (error) {
    throw new Error(error);
  }
};

const changePassCode = async (email, password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  const [passwordUpdate] = await db.query(
    "UPDATE users SET user_password = ? WHERE user_email = ?",
    [hashPassword, email]
  );

  if (!passwordUpdate.affectedRows > 0) {
    return { ok: false, message: "User not found" };
  }

  return { ok: true };
};

module.exports = {
  changeProfilePicture,
  changeUserName,
  changeUserEmail,
  emailUpdate,
  changeUserPasswod,
  sendChangePassCode,
  changePassCode,
};
