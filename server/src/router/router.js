const express = require("express");
const upload = require("../configs/multer");
const {
  changeUserName,
  changeUserEmail,
  emailUpdate,
  changeUserPasswod,
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
const { signup, verify, login, userIsLogged } = require("../controllers/auth");
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
} = require("../controllers/updates");

const router = express.Router();

// AUTH CONTROLLERS
router.get("/user_is_logged", userIsLogged);
router.post("/signup", signup);
router.post("/verify", verify);
router.post("/login", login);

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

// CHANGING THE NAME
router.post("/change_name", async (req, res, next) => {
  try {
    // USER DATA
    const { name, lastname, password } = req.body;

    // CHANGING THE NAME
    const changeName = await changeUserName(
      name,
      lastname,
      password,
      req.session.userID
    );

    if (!changeName.ok)
      return next(new ServerError(changeName.message, changeName.status));

    res.status(200).json({ ok: true, message: "Name changed" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// CHANGING THE EMAIL
router.post("/change_email", async (req, res, next) => {
  try {
    // USER DATA
    const { email, password } = req.body;

    // CHANGING THE EMAIL
    const changeEmail = await changeUserEmail(
      email,
      password,
      req.session.userID
    );

    if (!changeEmail.ok)
      return next(new ServerError(changeEmail.message, changeEmail.status));

    // CREATING EMAIL AND CODE VARIABLES IN THE SESSION
    req.session.user_email = email;
    req.session.code = changeEmail.code;

    // DELETING THE CODE FROM THE SESSION AFTER 3 MINS
    setTimeout(() => {
      delete req.session.code;
      delete req.session.user_email;
      req.session.save();
    }, 180000);

    res.json({ ok: true, message: "Code sent to your new email" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// CHANGING THE EMAIL AND VERIFYING THE CODE
router.post("/change_email_code", async (req, res, next) => {
  try {
    // VERIFYING THE CODE
    if (!req.session.code)
      return next(new ServerError("Code may expired", 400));

    if (req.session.code != req.body.code)
      return next(new ServerError("The code is incorrect", 400));

    // TAKING THE USER DATA FROM THE TEMPORARY SESSION VARIABLE
    const { user_email } = req.session;
    // UPDATING THE EMAIL
    await emailUpdate(user_email, req.session.userID);

    res.status(201).json({ ok: true, message: "Email updated" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// CHANGING THE PASSWORD
router.post("/change_password", async (req, res, next) => {
  try {
    // USER DATA
    const { oldPassword, newPassword } = req.body;

    // CHANGING THE PASSWORD
    const changePassword = await changeUserPasswod(
      oldPassword,
      newPassword,
      req.session.userID
    );

    if (!changePassword.ok)
      return next(
        new ServerError(changePassword.message, changePassword.status)
      );

    res.status(201).json({ ok: true, message: changePassword.message });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

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
router.post("/logout", (req, res) => {
  // DESTROYING THE SESSION
  req.session.destroy();
  res.status(201).json({ ok: true, message: "Logout successful" });
});

// DELETE ACCOUNT
router.delete("/delete_account", async (req, res, next) => {
  try {
    // MY USER ID
    const userId = req.session.userID;

    // DELETING THE ACCOUNT
    const accountDeleted = await deleteUserAccount(userId);

    // DESTROYING THE SESSION
    req.session.destroy();
    res.status(201).json({ ok: true, message: accountDeleted.message });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});
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
