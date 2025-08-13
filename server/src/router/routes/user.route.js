const { Router } = require("express");
const {
  getUserCredentials,
  gettingUserById,
  gettingFollowingUsers,
} = require("../../controllers/user");
const userRouter = Router();

userRouter.get("/me", getUserCredentials);
userRouter.get("/user/:user_id", gettingUserById);
userRouter.get("/following", gettingFollowingUsers);

module.exports = userRouter;
