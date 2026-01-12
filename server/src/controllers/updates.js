const ServerError = require("../error/errorClass");
const {
  changeProfilePicture,
  profilePictureDelete,
  changeUserName,
  changeUserAlias,
  changeUserPasswod,
  changeUserEmail,
  emailUpdate,
  sendChangePassCode,
  changePassCode,
} = require("../services/router.services/updateServices");
const jwt = require("jsonwebtoken");

const changingUserProfilePicture = async (req, res, next) => {
  try {
    // FILE
    const { filename } = req.file;

    // CHANGING THE PROFILE PICTURE
    const profileUpdate = await changeProfilePicture(filename, req.userId);
    if (!profileUpdate.ok) {
      return next(
        new ServerError(
          profileUpdate.message,
          "profile picture",
          profileUpdate.status
        )
      );
    }

    res.status(204).end();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const deletingProfilePicture = async (req, res, next) => {
  try {
    // DELETING THE PROFILE PICTURE
    const deleted = await profilePictureDelete(req.userId);
    if (!deleted.ok)
      return next(
        new ServerError(deleted.message, "profile delete", deleted.status)
      );

    res.status(204).end();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const changingName = async (req, res, next) => {
  try {
    // USER DATA
    const { name, password } = req.body;

    // CHANGING THE NAME
    const changeName = await changeUserName(name, password, req.userId);
    if (!changeName.ok)
      return next(
        new ServerError(changeName.message, "name changing", changeName.status)
      );

    res.status(204).end();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const changingAlias = async (req, res, next) => {
  try {
    // USER DATA
    const { alias, password } = req.body;

    // CHANGING THE NAME
    const changeAlias = await changeUserAlias(alias, password, req.userId);
    if (!changeAlias.ok)
      return next(
        new ServerError(
          changeAlias.message,
          "name changing",
          changeAlias.status
        )
      );

    res.status(204).end();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const changingPassword = async (req, res, next) => {
  try {
    // PASSWORDS FROM USER
    const { oldPassword, newPassword } = req.body;

    // CHANGING THE PASSWORD
    const changePassword = await changeUserPasswod(
      oldPassword,
      newPassword,
      req.userId
    );
    if (!changePassword.ok)
      return next(
        new ServerError(
          changePassword.message,
          "password changing",
          changePassword.status
        )
      );

    res.status(204).end();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const ChangingEmail = async (req, res, next) => {
  try {
    // USER DATA
    const { email, password } = req.body;

    // CHANGING THE EMAIL
    const changeEmail = await changeUserEmail(email, password, req.userId);
    if (!changeEmail.ok)
      return next(
        new ServerError(
          changeEmail.message,
          "email changing",
          changeEmail.status
        )
      );

    const changeEmailCode = jwt.sign(
      { email, code: changeEmail.code },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    res
      .cookie("emailChangeCode", changeEmailCode, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 5,
      })
      .status(200)
      .json({ message: "A code has been sent to your new email" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const sendingEmailChangeCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const payload = jwt.verify(
      req.cookies.emailChangeCode,
      process.env.EMAIL_TOKEN_SECRET
    );
    if (!payload) return next(new ServerError("Code may expired", "code", 400));

    // verifiying if the codes match
    if (payload.code !== code)
      return next(new ServerError("The code is incorrect", "code", 400));

    // updating the email
    await emailUpdate(payload.email, req.userId);

    res
      .clearCookie("emailChangeCode", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .status(204)
      .end();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const emailForgotPassword = async (req, res, next) => {
  try {
    // USER DATA
    const { email } = req.body;

    // SENDING A VERIFY CODE TO THE USER EMAIL
    const forgotPassword = await sendChangePassCode(email);
    if (!forgotPassword.ok)
      return next(
        new ServerError(
          forgotPassword.message,
          "forgot password",
          forgotPassword.status
        )
      );

    const forgotPassCode = jwt.sign(
      { email, code: forgotPassword.code },
      process.env.PASSWORD_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    res
      .cookie("forgotPassCode", forgotPassCode, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 5,
      })
      .status(200)
      .json({ message: "A code has been sent to your email" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const codeEmailForgotPasword = async (req, res, next) => {
  try {
    // USER DATA
    const { code, password } = req.body;
    const payload = jwt.verify(
      req.cookies.forgotPassCode,
      process.env.PASSWORD_TOKEN_SECRET
    );
    console.log("Code may expired");
    if (!payload) return next(new ServerError("Code may expired", "code", 400));

    console.log("The code is incorrect");

    // VERIFYING IF THE CODES MATCH
    if (payload.code !== code)
      return next(new ServerError("The code is incorrect", "code", 400));

    // updating the password
    await changePassCode(payload.email, password);

    res
      .clearCookie("forgotPassCode", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .status(204)
      .end();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = {
  changingUserProfilePicture,
  deletingProfilePicture,
  changingName,
  changingAlias,
  changingPassword,
  ChangingEmail,
  sendingEmailChangeCode,
  emailForgotPassword,
  codeEmailForgotPasword,
};
