const { Router } = require("express");
const upload = require("../../utils/multer");
const {
  changingUserProfilePicture,
  deletingProfilePicture,
  changingName,
  changingAlias,
  changingPassword,
  ChangingEmail,
  sendingEmailChangeCode,
} = require("../../controllers/updates");
const updatesRouter = Router();

updatesRouter.post(
  "/profile",
  upload.single("file"),
  changingUserProfilePicture
);
updatesRouter.delete("/profile", deletingProfilePicture);
updatesRouter.post("/name", changingName);
updatesRouter.post("/alias", changingAlias);
updatesRouter.post("/password", changingPassword);
updatesRouter.post("/email", ChangingEmail);
updatesRouter.post("/email/code", sendingEmailChangeCode);

module.exports = updatesRouter;
