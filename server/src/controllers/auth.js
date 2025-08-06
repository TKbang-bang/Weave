const ServerError = require("../error/errorClass");
const {
  deleteUserAccount,
} = require("../services/router.services/accountServices");
const {
  getUserByEmail,
  createUser,
  getUserId,
  getUserByAlias,
} = require("../services/router.services/userServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailSend = require("../utils/nodemailer");
const {
  createAccessToken,
  createRefreshToken,
  refreshTokenOptions,
} = require("../utils/token");

const isUserLogged = async (req, res, next) => {
  try {
    if (!req.userId)
      return next(new ServerError("User is not logged", "user auth", 401));

    return res.status(204).json({ message: "User is logged" });
  } catch (error) {
    next(new ServerError(error.message, "server", 500));
  }
};

const signup = async (req, res, next) => {
  try {
    // user credentials
    const { name, alias, email, password } = req.body;

    // checking if the email is already in use
    const userByEmail = await getUserByEmail(email);
    if (userByEmail)
      return next(new ServerError("Email already registered", "email", 409));

    // checking if the alias is already in use
    const userByAlias = await getUserByAlias(alias);
    if (userByAlias)
      return next(new ServerError("Alias already registered", "alias", 409));

    // sending the verify code to the user email
    const sendMail = await emailSend(email);
    if (!sendMail.ok)
      return next(new ServerError(sendMail.message, "email", 500));

    // user credentials and code together
    const data = {
      name,
      alias,
      email,
      password,
      code: sendMail.code,
    };

    // signing the user data and the verify code
    const codeToken = jwt.sign(data, process.env.CODE_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    // sending the code and the user credentials in the cookie
    res
      .cookie("code", codeToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 5,
      })
      .status(201)
      .json({ message: "Code sent to your email" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const verify = async (req, res, next) => {
  try {
    // code from user
    const { code } = req.body;

    // verifiying the token with the code and user credentials
    const payload = jwt.verify(req.cookies.code, process.env.CODE_TOKEN_SECRET);
    if (!payload) return next(new ServerError("Code may expired", "code", 400));

    // verifying the code
    if (payload.code !== code)
      return next(new ServerError("The code is incorrect", "code", 400));

    // user credentials from the token
    const { name, alias, email, password } = payload;

    // creating the user
    const creatingUser = await createUser(name, alias, email, password);

    // creating the tokens
    const accessToken = createAccessToken(creatingUser);
    const refreshToken = createRefreshToken(creatingUser);

    // sending the tokens
    res
      .clearCookie("code")
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .status(200)
      .json({
        accessToken,
        message: "User created",
      });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const login = async (req, res, next) => {
  try {
    // USER DATA
    const { email, password } = req.body;

    // CHECKING IF THE USER EXISTS
    const user = await getUserByEmail(email);
    if (!user) return next(new ServerError("Email not found", "email", 404));

    // CHECKING THE PASSWORD
    const validPassword = await bcrypt.compare(password, user.user_password);
    if (!validPassword)
      return next(new ServerError("Wrong password", "password", 400));

    // SAVING THE USER ID IN THE SESSION
    req.session.userID = user.user_id;
    req.session.save();

    res.status(201).json({ ok: true });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const deletingAccount = async (req, res, next) => {
  try {
    // MY USER ID
    const userId = req.session.userID;

    // DELETING THE ACCOUNT
    const accountDeleted = await deleteUserAccount(userId);
    if (!accountDeleted.ok)
      return next(
        new ServerError(accountDeleted.message, "account deleting", 500)
      );

    // DESTROYING THE SESSION
    req.session.destroy();
    res.status(201).json({ ok: true, message: accountDeleted.message });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { signup, verify, login, isUserLogged, deletingAccount };
