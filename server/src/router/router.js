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

const router = express.Router();

// VERIFYING IF USER IS LOGGED
router.get("/user_verify", async (req, res, next) => {
  try {
    if (!req.session.userID)
      return next(new ServerError("User is not logged", 401));

    const gettingUserId = await getUserId(req.session.userID);
    if (!gettingUserId) return next(new ServerError("User not found", 404));

    return res.status(204).json({ ok: true, message: "User is logged" });
  } catch (error) {
    next(new ServerError(error.message, 500));
  }
});

// SIGNUP PROCESS
router.post("/signup", async (req, res, next) => {
  try {
    // USER DATA
    const { name, lastname, email, password } = req.body;

    // CHECKING IF THE USER ALREADY EXISTS
    const user = await getUserByEmail(email);

    if (user) return next(new ServerError("User already exists", 409));

    const sendMail = await emialSend(email);

    req.session.nextUser = { name, lastname, email, password };
    req.session.code = sendMail.code;
    req.session.save();

    res.status(201).json({ ok: true });

    setTimeout(() => {
      delete req.session.nextUser;
      delete req.session.code;
      req.session.save();
    }, [180000]);
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// VERIFYING THE CODE TO SIGN THE USER
router.post("/verify", async (req, res, next) => {
  try {
    // CODE FORM USER

    const { code } = req.body;

    // VERIFYING THE CODE
    if (!req.session.code)
      return next(new ServerError("Code may expired", 400));

    if (req.session.code != code)
      return next(new ServerError("Code incorrect", 400));

    const { name, lastname, email, password } = req.session.nextUser;

    // CREATING THE USER
    const ceratingUser = await createUser(name, lastname, email, password);

    req.session.userID = ceratingUser;
    req.session.save();

    res.status(201).json({ ok: true });

    delete req.session.code;
    delete req.session.nextUser;
    req.session.save();
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// LOGIN PROCESS
router.post("/login", async (req, res, next) => {
  try {
    // USER DATA
    const { email, password } = req.body;

    // CHECKING IF THE USER EXISTS
    const user = await getUserByEmail(email);

    if (!user) return next(new ServerError("User not found", 404));

    const validPassword = await bcrypt.compare(password, user.user_password);

    if (!validPassword) return next(new ServerError("Wrong password", 400));

    req.session.userID = user.user_id;
    req.session.save();

    res.status(201).json({ ok: true });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

// POSTING PROCESS
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

router.get("/posts", async (req, res, next) => {
  try {
    const posts = await getAllPosts(req.session.userID);

    res.status(200).json({ ok: true, posts });
  } catch (error) {
    console.log(error);
    return next(new ServerError(error.message, 500));
  }
});

router.post("/follow", async (req, res, next) => {
  try {
    const { user_id } = req.body;

    const following = await isFollowing(req.session.userID, user_id);

    if (!following) {
      await followUser(req.session.userID, user_id);
      res.status(200).json({ ok: true, followed: true });
    } else {
      await unFollowUser(req.session.userID, user_id);
      res.status(200).json({ ok: true, followed: false });
    }
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.post("/edit_post", async (req, res, next) => {
  try {
    const { post_id, post_title } = req.body;

    const isPostOwner = await postOwner(req.session.userID, post_id);

    if (!isPostOwner)
      return next(new ServerError("You are not the owner of this post", 403));

    await postUpdate(post_title, post_id);
    res.json({ ok: true });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.post("/like", async (req, res, next) => {
  try {
    const { post_id } = req.body;

    const liked = await hasLiked(req.session.userID, post_id);

    if (liked) {
      await unLike(req.session.userID, post_id);
      res.status(200).json({ ok: true, liked: false });
    } else {
      await like(req.session.userID, post_id);
      res.status(200).json({ ok: true, liked: true });
    }
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.get("/post/:post_id", async (req, res, next) => {
  try {
    const { post_id } = req.params;

    const post = await getPostById(req.session.userID, post_id);
    const comments = await getCommentsByPostId(post_id);

    if (!post) {
      return next(new ServerError("Post not found", 404));
    }

    post.allComments = comments;
    res.status(200).json({ ok: true, posts: [post] });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.get("/user_id", (req, res, next) => {
  try {
    if (!req.session.userID) {
      return next(new ServerError("User is not logged", 401));
    }

    res.status(200).json({ ok: true, user_id: req.session.userID });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const user = await getUserById(req.session.userID, req.session.userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ ok: true, user });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.get("/user_posts", async (req, res, next) => {
  try {
    const posts = await getUserPosts(req.session.userID, req.session.userID);
    res.json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.get("/user_/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const user = await getUserById(req.session.userID, user_id);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.status(200).json({ ok: true, user });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.get("/user_posts_/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const posts = await getUserPosts(req.session.userID, user_id);
    res.status(200).json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.post(
  "/change_profile_picture",
  upload.single("file"),
  async (req, res, next) => {
    try {
      const { filename } = req.file;

      const profileUpdate = await changeProfilePicture(
        filename,
        req.session.userID
      );
      if (profileUpdate == false) {
        return next(new ServerError("Something went wrong", 500));
      }

      res.status(200).json({ ok: true, message: "Profile picture updated" });
    } catch (error) {
      return next(new ServerError(error.message, 500));
    }
  }
);

router.post("/change_name", async (req, res, next) => {
  try {
    const { name, lastname, password } = req.body;

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

router.post("/change_email", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const changeEmail = await changeUserEmail(
      email,
      password,
      req.session.userID
    );

    if (!changeEmail.ok)
      return next(new ServerError(changeEmail.message, changeEmail.status));

    req.session.user_email = email;
    req.session.code = changeEmail.code;

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

router.post("/change_email_code", async (req, res, next) => {
  try {
    if (!req.session.code)
      return next(new ServerError("Code may expired", 400));

    if (req.session.code != req.body.code)
      return next(new ServerError("The code is incorrect", 400));

    const { user_email } = req.session;
    await emailUpdate(user_email, req.session.userID);

    res.status(201).json({ ok: true, message: "Email updated" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.post("/change_password", async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

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

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(201).json({ ok: true, message: "Logout successful" });
});

router.delete("/delete_account", async (req, res, next) => {
  try {
    const userId = req.session.userID;

    const accountDeleted = await deleteUserAccount(userId);

    req.session.destroy();
    res.status(201).json({ ok: true, message: accountDeleted.message });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.delete("/delete_post/:post_id", async (req, res, next) => {
  try {
    const { post_id } = req.params;

    await deletePost(post_id);
    res.status(201).json({ ok: true, message: "Post deleted" });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.post("/email_forgot_password", async (req, res, next) => {
  try {
    const { email } = req.body;

    const forgotPassword = await sendChangePassCode(email);

    if (!forgotPassword.ok)
      return next(
        new ServerError(forgotPassword.message, forgotPassword.status)
      );

    req.session.code = forgotPassword.code;
    req.session.user_email = email;

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

router.post("/code_password", async (req, res, next) => {
  try {
    const { code, password } = req.body;

    if (!req.session.code)
      return next(new ServerError("Code may expired", 400));

    if (req.session.code != code)
      return next(new ServerError("The code is incorrect", 400));

    const changePassword = await changePassCode(
      req.session.user_email,
      password
    );

    if (!changePassword.ok)
      return next(
        new ServerError(changePassword.message, changePassword.status)
      );

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

router.get("/user_search/:search", async (req, res, next) => {
  try {
    const { search } = req.params;

    const searched = await usersSearch(search, req.session.userID);

    res.status(200).json({ ok: true, users: searched });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

router.get("/user_posts_by_word/:word", async (req, res, next) => {
  try {
    const { word } = req.params;

    const { posts } = await postsSearch(req.session.userID, word);
    res.status(200).json({ ok: true, posts });
  } catch (error) {
    return next(new ServerError(error.message, 500));
  }
});

module.exports = router;
