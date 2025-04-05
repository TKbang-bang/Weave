const express = require("express");
const bcrypt = require("bcrypt");
const upload = require("../configs/multer");
const {
  getUserId,
  getUserByEmail,
  createUser,
  getUserById,
} = require("../services/router.services/userServices");
const {
  createPost,
  postOwner,
  postUpdate,
  deletePost,
} = require("../services/router.services/postServices");
const {
  getAllPosts,
  getPostById,
  getCommentsByPostId,
  getUserPosts,
} = require("../services/router.services/bigPostsServices");
const {
  isFollowing,
  unFollowUser,
  followUser,
} = require("../services/router.services/followServices");
const {
  hasLiked,
  unLike,
  like,
} = require("../services/router.services/likesServices");
const {
  changeProfilePicture,
  changeUserName,
  changeUserEmail,
  emailUpdate,
  changeUserPasswod,
  changePassCode,
  sendChangePassCode,
} = require("../services/router.services/updateServices");
const {
  deleteUserAccount,
  emialSend,
} = require("../services/router.services/accountServices");
const {
  usersSearch,
  postsSearch,
} = require("../services/router.services/searchServices");
const ServerError = require("../error/errorClass");
const { signup, verify, login, userIsLogged } = require("../controllers/auth");

const router = express.Router();

//
// VERIFYING IF THE USER IS LOGGED -- START
router.get("/user_is_logged", userIsLogged);
// VERIFYING IF THE USER IS LOGGED -- END
//

//
// AUTH -- START
router.post("/signup", signup);

// VERIFYING THE CODE
router.post("/verify", verify);

router.post("/login", login);
// AUTH -- END
//

//
// POSTS ACTIVITIES -- START
// PUBLICATING A POST
router.post("/publicate", upload.single("file"), async (req, res, next) => {
  try {
    // POST DATA
    const { title } = req.body;
    const file = req.file.filename;

    // CREATING THE POST
    await createPost(title, file, req.session.userID);

    res.status(201).json({ ok: true });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// GETTING ALL POSTS
router.get("/posts", async (req, res, next) => {
  try {
    // GETTING ALL POSTS
    const posts = await getAllPosts(req.session.userID);

    res.status(200).json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// GETTING A POST BY ID
router.get("/post/:post_id", async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.params;

    // GETTING THE POST
    const post = await getPostById(req.session.userID, post_id);
    // GETTING THE COMMENTS
    const comments = await getCommentsByPostId(post_id);

    if (!post) {
      return next(new ServerError("Post not found", 404));
    }

    // ADDING THE COMMENTS
    post.allComments = comments;
    res.status(200).json({ ok: true, posts: [post] });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// GETTING MY POSTS
router.get("/user_posts", async (req, res, next) => {
  try {
    // GETTING USER POSTS
    const posts = await getUserPosts(req.session.userID, req.session.userID);
    res.json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// GETTING A USER POSTS
router.get("/user_posts_/:user_id", async (req, res, next) => {
  try {
    // USER ID
    const { user_id } = req.params;

    // GETTING USER POSTS
    const posts = await getUserPosts(req.session.userID, user_id);
    res.status(200).json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// DELETING A POST
router.delete("/delete_post/:post_id", async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.params;

    // DELETING THE POST
    await deletePost(post_id);
    res.status(201).json({ ok: true, message: "Post deleted" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});
// POSTS ACTIVITIES -- END
//

//
// USER ACTIVITIES -- START
// FOLLOW CONTROLLER
router.post("/follow", async (req, res, next) => {
  try {
    // USER ID
    const { user_id } = req.body;

    // CHECKING IF THE USER IS ALREADY FOLLOWING
    const following = await isFollowing(req.session.userID, user_id);

    if (!following) {
      // FOLLOWING THE USER
      await followUser(req.session.userID, user_id);
      res.status(200).json({ ok: true, followed: true });
    } else {
      // UNFOLLOWING THE USER
      await unFollowUser(req.session.userID, user_id);
      res.status(200).json({ ok: true, followed: false });
    }
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// EDITING A POST
router.post("/edit_post", async (req, res, next) => {
  try {
    // POST DATA
    const { post_id, post_title } = req.body;

    // CHECKING IF THE POST BELONGS TO THE USER
    const isPostOwner = await postOwner(req.session.userID, post_id);

    if (!isPostOwner)
      return next(new ServerError("You are not the owner of this post", 403));

    // UPDATING THE POST
    await postUpdate(post_title, post_id);
    res.json({ ok: true });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// LIKE CONTROLLER
router.post("/like", async (req, res, next) => {
  try {
    // POST ID
    const { post_id } = req.body;

    // CHECKING IF THE POST IS ALREADY LIKED
    const liked = await hasLiked(req.session.userID, post_id);

    if (liked) {
      // UNLIKING THE POST
      await unLike(req.session.userID, post_id);
      res.status(200).json({ ok: true, liked: false });
    } else {
      // LIKING THE POST
      await like(req.session.userID, post_id);
      res.status(200).json({ ok: true, liked: true });
    }
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});
// USER ACTIVITIES -- END
//

//
// GETTING USER CREDENTIALS -- START
// GETTING USER ID
router.get("/user_id", (req, res, next) => {
  try {
    // CHECKING IF THE USER IS LOGGED
    if (!req.session.userID) {
      return next(new ServerError("User is not logged", 401));
    }

    res.status(200).json({ ok: true, user_id: req.session.userID });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// GETTING USER
router.get("/user", async (req, res, next) => {
  try {
    // GETTING USER
    const user = await getUserById(req.session.userID, req.session.userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ ok: true, user });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// GETTING USER BY ID
router.get("/user_/:user_id", async (req, res, next) => {
  try {
    // USER ID
    const { user_id } = req.params;

    // GETTING USER
    const user = await getUserById(req.session.userID, user_id);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.status(200).json({ ok: true, user });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});
// GETTING USER CREDENTIALS -- END
//

//
// USER SETTINGS -- START
// CHANGING THE PROFILE PICTURE
router.post(
  "/change_profile_picture",
  upload.single("file"),
  async (req, res, next) => {
    try {
      // GETTING THE FILE
      const { filename } = req.file;

      // CHANGING THE PROFILE PICTURE
      const profileUpdate = await changeProfilePicture(
        filename,
        req.session.userID
      );
      if (!profileUpdate) {
        return next(new ServerError("Something went wrong", 500));
      }

      res.status(200).json({ ok: true, message: "Profile picture updated" });
    } catch (error) {
      return next(new ServerError(error.message, 500));
    }
  }
);

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
