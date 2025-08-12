const db = require("../../database/db");
const bcrypt = require("bcrypt");
const { User } = require("../../../models");
const emailSend = require("../../utils/nodemailer");

const changeProfilePicture = async (filename, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return { ok: false, message: "User not found", status: 404 };

    await user.update({ profile: filename });
    return { ok: true };
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserName = async (name, password, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return { ok: false, message: "User not found", status: 404 };

    // vrifiying if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return { ok: false, message: "Incorrect password", status: 400 };

    // updating the name
    await user.update({ name });
    return { ok: true };
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserAlias = async (alias, password, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return { ok: false, message: "User not found", status: 404 };

    // vrifiying if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return { ok: false, message: "Incorrect password", status: 400 };

    // updating the name
    await user.update({ alias });
    return { ok: true };
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserEmail = async (email, password, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return { ok: false, message: "User not found", status: 404 };

    // vrifiying if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return { ok: false, message: "Incorrect password", status: 400 };

    const isEmailUsed = await User.findOne({ where: { email } });
    if (isEmailUsed)
      return { ok: false, message: "Email already in use", status: 409 };

    const sendMail = await emailSend(email);
    if (!sendMail.ok)
      return { ok: false, message: sendMail.message, status: 500 };

    return { ok: true, code: sendMail.code };
  } catch (error) {
    throw new Error(error);
  }
};

const emailUpdate = async (email, userId) => {
  try {
    await User.update({ email }, { where: { id: userId } });
  } catch (error) {
    throw new Error(error);
  }
};

const changeUserPasswod = async (oldPassword, newPassword, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return { ok: false, message: "User not found", status: 404 };

    // vrifiying if the password is correct
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect)
      return { ok: false, message: "Incorrect password", status: 400 };

    if (oldPassword == newPassword)
      return {
        ok: false,
        message: "New password cannot be the same as the old one",
        status: 400,
      };

    // updating the password
    await user.update({ password: newPassword });

    return { ok: true };
  } catch (error) {
    throw new Error(error);
  }
};

const sendChangePassCode = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return { ok: false, message: "User not found", status: 404 };

    const sendMail = await emailSend(email);

    if (!sendMail.ok)
      return { ok: false, message: "Failed to send email", status: 500 };

    return { ok: true, code: sendMail.code, userId: user.id };
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
    const user = await User.findByPk(userId);
    if (!user) return { ok: false, message: "User not found", status: 404 };

    await user.update({ profile: null });
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
