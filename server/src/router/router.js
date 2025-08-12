const express = require("express");
const upload = require("../configs/multer");
const {
  signup,
  verify,
  login,
  deletingAccount,
  isUserLogged,
  verifyToken,
} = require("../controllers/auth");
const {
  getPosts,
  getPostsById,
  gettingSavedPosts,
} = require("../controllers/bigPosts");
const {
  posting,
  gettingMyUserPosts,
  gettingComments,
  gettingUserPosts,
} = require("../controllers/posts");
const {
  editTitle,
  likingPost,
  deletingPost,
  following,
  savingPost,
} = require("../controllers/activities");
const {
  getUserCredentials,
  gettingUserById,
  gettingFollowingUsers,
} = require("../controllers/user");
const {
  changingUserProfilePicture,
  deletingProfilePicture,
  changingName,
  changingAlias,
  changingPassword,
  ChangingEmail,
  sendingEmailChangeCode,
  emailForgotPassword,
  codeEmailForgotPasword,
} = require("../controllers/updates");
const { userSearching, postSearching } = require("../controllers/search");
const sessionMiddleware = require("../middlewares/session.middleware");

const router = express.Router();

// AUTH CONTROLLERS
router.get("/is_user_logged", sessionMiddleware, isUserLogged);
router.get("/verifyToken", sessionMiddleware, verifyToken);
router.post("/signup", signup);
router.post("/verify", verify);
router.post("/login", login);
router.get("/logout", sessionMiddleware, (req, res) => {
  req.userId = null;
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.status(204).end();
});
router.delete("/delete_account", sessionMiddleware, deletingAccount);

// POSTS CONTROLLERS
router.post("/publicate", sessionMiddleware, upload.single("file"), posting);
router.get("/posts", sessionMiddleware, getPosts);
router.get("/comments/:postId", sessionMiddleware, gettingComments);
router.get("/post/:post_id", getPostsById);
router.get("/user_posts", sessionMiddleware, gettingMyUserPosts);
router.get("/user_posts_/:user_id", sessionMiddleware, gettingUserPosts);
router.get("/saved_posts", sessionMiddleware, gettingSavedPosts);

// SEARCH
router.get("/user_search/:search", sessionMiddleware, userSearching);
router.get("/posts_search_by_word/:search", sessionMiddleware, postSearching);

// USER ACTIVITIES CONTROLLERS
router.delete("/delete_post/:post_id", sessionMiddleware, deletingPost);
router.post("/follow", sessionMiddleware, following);
router.put("/edit_post/:post_id", sessionMiddleware, editTitle);
router.post("/like", sessionMiddleware, likingPost);
router.post("/save", sessionMiddleware, savingPost);

// GETTING USER CREDENTIALS CONTROLLERS
router.get("/user", sessionMiddleware, getUserCredentials);
router.get("/user_/:user_id", sessionMiddleware, gettingUserById);
router.get("/user_following", gettingFollowingUsers);

// ACCOUNT SETTINGS CONTROLLERS
router.post(
  "/change_profile_picture",
  sessionMiddleware,
  upload.single("file"),
  changingUserProfilePicture
);
router.delete(
  "/delete_profile_picture",
  sessionMiddleware,
  deletingProfilePicture
);
router.post("/change_name", sessionMiddleware, changingName);
router.post("/change_alias", sessionMiddleware, changingAlias);
router.post("/change_password", sessionMiddleware, changingPassword);
router.post("/change_email", sessionMiddleware, ChangingEmail);
router.post("/change_email_code", sessionMiddleware, sendingEmailChangeCode);

// FORGOT PASSWORD
router.post("/email_forgot_password", emailForgotPassword);
router.post("/code_email_forgot_password", codeEmailForgotPasword);

module.exports = router;
