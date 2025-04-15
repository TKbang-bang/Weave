const express = require("express");
const upload = require("../configs/multer");
const {
  signup,
  verify,
  login,
  userIsLogged,
  deletingAccount,
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
  getUserId,
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

const router = express.Router();

// AUTH CONTROLLERS
router.get("/user_is_logged", userIsLogged);
router.post("/signup", signup);
router.post("/verify", verify);
router.post("/login", login);
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(201).json({ ok: true, message: "Loged out successful" });
});
router.delete("/delete_account", deletingAccount);

// POSTS CONTROLLERS
router.post("/publicate", upload.single("file"), posting);
router.get("/posts", getPosts);
router.get("/comments/:post_id", gettingComments);
router.get("/post/:post_id", getPostsById);
router.get("/user_posts", gettingMyUserPosts);
router.get("/user_posts_/:user_id", gettingUserPosts);
router.get("/saved_posts", gettingSavedPosts);

// SEARCH
router.get("/user_search/:search", userSearching);
router.get("/posts_search_by_word/:search", postSearching);

// USER ACTIVITIES CONTROLLERS
router.delete("/delete_post/:post_id", deletingPost);
router.post("/follow", following);
router.put("/edit_post/:post_id", editTitle);
router.post("/like", likingPost);
router.get("/user_id", getUserId);
router.post("/save", savingPost);

// GETTING USER CREDENTIALS CONTROLLERS
router.get("/user", getUserCredentials);
router.get("/user_/:user_id", gettingUserById);
router.get("/user_following", gettingFollowingUsers);

// ACCOUNT SETTINGS CONTROLLERS
router.post(
  "/change_profile_picture",
  upload.single("file"),
  changingUserProfilePicture
);
router.delete("/delete_profile_picture", deletingProfilePicture);
router.post("/change_name", changingName);
router.post("/change_alias", changingAlias);
router.post("/change_password", changingPassword);
router.post("/change_email", ChangingEmail);
router.post("/change_email_code", sendingEmailChangeCode);

// FORGOT PASSWORD
router.post("/email_forgot_password", emailForgotPassword);
router.post("/code_email_forgot_password", codeEmailForgotPasword);

module.exports = router;
