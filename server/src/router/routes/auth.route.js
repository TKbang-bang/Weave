const { Router } = require("express");
const { signup, login, verify } = require("../../controllers/auth");
const {
  emailForgotPassword,
  codeEmailForgotPasword,
} = require("../../controllers/updates");
const authRouter = Router();

// auth controllers
authRouter.post("/signup", signup);
authRouter.post("/verify", verify);
authRouter.post("/login", login);

// forgot password controllers
authRouter.post("/password", emailForgotPassword);
authRouter.post("/password/code", codeEmailForgotPasword);

module.exports = authRouter;
