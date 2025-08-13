const { Router } = require("express");
const postRouter = require("./posts.route");
const activitiesRouter = require("./activities.route");
const userRouter = require("./user.route");
const searchRouter = require("./search.route");
const updatesRouter = require("./updates.route");
const sessionRouter = require("./session.route");
const protectedRouter = Router();

// posts controllers
protectedRouter.use("/posts", postRouter);

// user activities controllers
protectedRouter.use("/activities", activitiesRouter);

// getting user credentials controllers
protectedRouter.use("/users", userRouter);

// search controllers
protectedRouter.use("/search", searchRouter);

// account updates controllers
protectedRouter.use("/updates", updatesRouter);

// session controllers
protectedRouter.use("/session", sessionRouter);

module.exports = protectedRouter;
