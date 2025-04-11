const express = require("express");
const upload = require("../configs/multer");
const {
  changePassCode,
  sendChangePassCode,
} = require("../services/router.services/updateServices");
const {
  deleteUserAccount,
} = require("../services/router.services/accountServices");
const {
  usersSearch,
  postsSearch,
} = require("../services/router.services/searchServices");
const ServerError = require("../error/errorClass");
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
} = require("../controllers/user");
const {
  changingUserProfilePicture,
  deletingProfilePicture,
  changingName,
  changingAlias,
  changingPassword,
  ChangingEmail,
  sendingEmailChangeCode,
} = require("../controllers/updates");

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

// CHANGING THE PASSWORD

// FORGOT PASSWORD
router.post("/email_forgot_password", async (req, res, next) => {
  try {
    // USER DATA
    const { email } = req.body;

    // SENDING A VERIFY CODE TO THE USER EMAIL
    const forgotPassword = await sendChangePassCode(email);

    if (!forgotPassword.ok)
      return next(
        new ServerError(forgotPassword.message, forgotPassword.status)
      );

    // CREATING EMAIL AND CODE VARIABLES IN THE SESSION
    req.session.code = forgotPassword.code;
    req.session.user_email = email;

    // DELETING THE CODE FROM THE SESSION AFTER 3 MINS
    setTimeout(() => {
      delete req.session.code;
      delete req.session.user_email;
      req.session.save();
    }, [180000]);

    res.status(201).json({ ok: true });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// VERIFYING THE CODE FROM FORGOT PASSWORD
router.post("/code_password", async (req, res, next) => {
  try {
    // USER DATA
    const { code, password } = req.body;

    // VERIFYING THE CODE
    if (!req.session.code)
      return next(new ServerError("Code may expired", 400));

    if (req.session.code != code)
      return next(new ServerError("The code is incorrect", 400));

    // UPDATING THE PASSWORD
    const changePassword = await changePassCode(
      req.session.user_email,
      password
    );

    if (!changePassword.ok)
      return next(
        new ServerError(changePassword.message, changePassword.status)
      );

    // DELETING THE CODE AND EMAIL FROM THE SESSION
    delete req.session.code;
    delete req.session.user_email;
    req.session.save();

    res
      .status(201)
      .json({ ok: true, message: "Password changed successfully" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});
// USER SETTINGS -- END
//

//
// ACCOUNT SETTINGS -- START
// LOGIN OUT

// DELETE ACCOUNT

// ACCOUNT SETTINGS -- END
//

//
// SEARCH -- START
// SEARCHING USERS
router.get("/user_search/:search", async (req, res, next) => {
  try {
    // SERACH WORD
    const { search } = req.params;

    // SEARCHING
    const searched = await usersSearch(search, req.session.userID);

    res.status(200).json({ ok: true, users: searched });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// SEARCHING POSTS
router.get("/user_posts_by_word/:word", async (req, res, next) => {
  try {
    // SERACH WORD
    const { word } = req.params;

    // SEARCHING POSTS
    const { posts } = await postsSearch(req.session.userID, word);
    res.status(200).json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});
// SEARCH -- END
//

module.exports = router;
