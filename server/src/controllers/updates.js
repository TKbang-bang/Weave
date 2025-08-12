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

    res.status(204).end();
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

    // CREATING EMAIL AND CODE VARIABLES IN THE SESSION
    req.session.code = forgotPassword.code;
    req.session.user_email = email;
    req.session.userId = forgotPassword.userId;
    req.session.save();

    // DELETING THE CODE FROM THE SESSION AFTER 3 MINS
    setTimeout(() => {
      delete req.session.code;
      delete req.session.user_email;
      delete req.session.userId;
      req.session.save();
    }, [180000]);

    res
      .status(201)
      .json({ ok: true, message: "A code has been sent to your email" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const codeEmailForgotPasword = async (req, res, next) => {
  try {
    // USER DATA
    const { code, password } = req.body;

    // VERIFYING THE CODE
    if (!req.session.code)
      return next(new ServerError("Code may expired", "code", 400));

    // VERIFYING IF THE CODE IS CORRECT
    if (req.session.code != code)
      return next(new ServerError("The code is incorrect", "code", 400));

    // UPDATING THE PASSWORD
    const changePassword = await changePassCode(
      req.session.user_email,
      password
    );
    if (!changePassword.ok)
      return next(
        new ServerError(
          changePassword.message,
          "change password",
          changePassword.status
        )
      );

    // SAVING THE USER ID IN THE SESSION
    req.session.userID = req.session.userId;
    req.session.save();

    // DELETING THE CODE AND EMAIL FROM THE SESSION
    delete req.session.code;
    delete req.session.user_email;
    req.session.save();

    res
      .status(201)
      .json({ ok: true, message: "Password changed successfully" });
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
