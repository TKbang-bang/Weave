const express = require("express");
const sessionMiddleware = require("../middlewares/session.middleware");
const authRouter = require("./routes/auth.route");
const protectedRouter = require("./routes/protected.route");

const router = express.Router();

// auth routes
router.use("/auth", authRouter);

// protected routes
router.use("/protected", sessionMiddleware, protectedRouter);

module.exports = router;
