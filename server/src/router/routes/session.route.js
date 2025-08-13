const { Router } = require("express");
const {
  isUserLogged,
  verifyToken,
  deletingAccount,
} = require("../../controllers/auth");
const sessionRouter = Router();

sessionRouter.get("/logged", isUserLogged);
sessionRouter.get("/verify", verifyToken);
sessionRouter.delete("/account", deletingAccount);
sessionRouter.get("/logout", (req, res) => {
  req.userId = null;
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.status(204).end();
});

module.exports = sessionRouter;
