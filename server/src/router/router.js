const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { nanoid } = require("nanoid");
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
} = require("../services/router.services/accountServices");
const {
  usersSearch,
  postsSearch,
} = require("../services/router.services/searchServices");

const router = express.Router();

// VERIFYING IF USER IS LOGGED
router.get("/user_verify", (req, res) => {
  try {
    if (req.session.userID) {
      getUserId(req.session.userID).then((user_id) => {
        if (!user_id) {
          return res.json({ ok: false, message: "User not found" });
        }

        return res.json({ ok: true });
      });
    } else {
      return res.json({ ok: false, message: "Access denied" });
    }
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

// SIGNUP PROCESS
router.post("/signup", async (req, res) => {
  try {
    // USER DATA
    const { name, lastname, email, password } = req.body;

    // CHECKING IF THE USER ALREADY EXISTS
    getUserByEmail(email).then(async (user) => {
      if (user) {
        return res.json({ ok: false, message: "User already exists" });
      }

      // CODE GENERATION
      const code = nanoid(5);

      // SENDING EMAIL PROCESS
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: `${email}`,
        subject: "Verification code",
        html: `<div>
              <p>Verification code</p>
              <h1>${code}</h1>
              </div>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.json({ ok: false, message: "Mail failed to send" });
        } else {
          if (info.accepted) {
            //  CREATING A SESSION VARIABLE TO SAVE THE CREDENTIALS AND THE CODE
            req.session.nextUser = {
              name,
              lastname,
              email,
              password,
            };

            // SAVING THE CODE IN THE SESSION
            req.session.code = code;
            res.json({ ok: true });

            //  DELETING THE CODE AFTER THREE MINUTES
            setTimeout(() => {
              delete req.session.code;
              delete req.session.nextUser;
              req.session.save();
            }, 180000);
          } else {
            //  IF THERE WHERE NO ERROR BUT THE EMAIL WAS NOT SENT
            res.json({ ok: false, message: "Email not found" });
          }
        }
      });
    });
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

// VERIFYING THE CODE TO SIGN THE USER
router.post("/verify", async (req, res) => {
  try {
    // CODE FORM USER
    const { code } = req.body;

    // VERIFYING THE CODE
    if (req.session.code) {
      if (req.session.code == code) {
        // USER DATA
        const { name, lastname, email, password } = req.session.nextUser;

        // CREATING THE USER
        createUser(name, lastname, email, password).then((userId) => {
          // SAVING THE USERID IN THE SESSION
          req.session.userID = userId;
          req.session.save();

          res.send({ ok: true });

          // DELETING THE CODE AND THE USER DATA IN THE SESSION
          delete req.session.code;
          delete req.session.nextUser;
          req.session.save();
        });
      } else {
        // IF THE CODE IS NOT CORRECT
        res.send({ ok: false, message: "Wrong code" });
      }
    }
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

// LOGIN PROCESS
router.post("/login", async (req, res) => {
  try {
    // USER DATA
    const { email, password } = req.body;

    // CHECKING IF THE USER EXISTS
    getUserByEmail(email).then(async (user) => {
      if (!user) {
        return res.json({ ok: false, message: "User not found" });
      }

      // VERIFYING THE PASSWORD
      const validPassword = await bcrypt.compare(password, user.user_password);

      if (validPassword) {
        req.session.userID = user.user_id;
        req.session.save();

        res.json({ ok: true });
      } else {
        res.json({ ok: false, message: "Wrong password" });
      }
    });
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

// POSTING PROCESS
router.post("/publicate", upload.single("file"), (req, res) => {
  try {
    // POST DATA
    const { title } = req.body;
    const file = req.file.filename;

    // CREATING THE POST
    createPost(title, file, req.session.userID).then((postId) => {
      if (postId) {
        res.json({ ok: true });
      } else {
        res.json({ ok: false, message: "Something went wrong, try again" });
      }
    });
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/posts", async (req, res) => {
  const posts = await getAllPosts(req.session.userID);
  res.json(posts);
});

router.post("/follow", async (req, res) => {
  try {
    const { user_id } = req.body;

    const following = await isFollowing(req.session.userID, user_id);

    if (following) {
      await unFollowUser(req.session.userID, user_id);
      res.json({ ok: true, followed: false });
    } else {
      await followUser(req.session.userID, user_id);
      res.json({ ok: true, followed: true });
    }
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.post("/edit_post", async (req, res) => {
  try {
    const { post_id, post_title } = req.body;

    const isPostOwner = await postOwner(req.session.userID, post_id);

    if (isPostOwner) {
      await postUpdate(post_title, post_id);
      res.json({ ok: true });
    } else {
      res.json({ ok: false, message: "You are not the owner of this post" });
    }
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.post("/like", async (req, res) => {
  try {
    const { post_id } = req.body;

    const liked = await hasLiked(req.session.userID, post_id);

    if (liked) {
      await unLike(req.session.userID, post_id);
      res.json({ ok: true, liked: false });
    } else {
      await like(req.session.userID, post_id);
      res.json({ ok: true, liked: true });
    }
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/post/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await getPostById(req.session.userID, post_id);
    const comments = await getCommentsByPostId(post_id);

    if (!post) {
      return res.json({ ok: false, message: "Post not found" });
    }

    post.allComments = comments;
    res.json(post);
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/user_id", (req, res) => {
  try {
    if (!req.session.userID) {
      return res.json({ ok: false, message: "User not logged in" });
    }

    res.json({ ok: true, user_id: req.session.userID });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

router.get("/user", async (req, res) => {
  try {
    const user = await getUserById(req.session.userID, req.session.userID);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, user });
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/user_posts", async (req, res) => {
  try {
    const posts = await getUserPosts(req.session.userID, req.session.userID);
    res.json(posts);
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/user_/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await getUserById(req.session.userID, user_id);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, user });
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/user_posts_/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const posts = await getUserPosts(req.session.userID, user_id);
    res.json(posts);
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/user_profile", async (req, res) => {
  try {
    const user = await getUserById(req.session.userID, req.session.userID);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({ ok: true, user });
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.post(
  "/change_profile_picture",
  upload.single("file"),
  async (req, res) => {
    try {
      const { filename } = req.file;

      const profileUpdate = await changeProfilePicture(
        filename,
        req.session.userID
      );

      if (!profileUpdate) {
        return res.json({ ok: false, message: "Something went wrong" });
      }

      res.json({ ok: true, message: "Profile picture updated" });
    } catch (error) {
      console.log({ error });
      res.json({ ok: false, message: "Internal server error" });
    }
  }
);

router.post("/change_name", async (req, res) => {
  try {
    const { name, lastname, password } = req.body;

    const changeName = await changeUserName(
      name,
      lastname,
      password,
      req.session.userID
    );

    if (!changeName.ok)
      return res.json({
        ok: false,
        message: changeName.message
          ? changeName.message
          : "Something went wrong",
      });

    res.json({ ok: true, message: "Name changed" });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      message: "Internal server error",
    });
  }
});

router.post("/change_email", async (req, res) => {
  try {
    const { email, password } = req.body;

    const changeEmail = await changeUserEmail(
      email,
      password,
      req.session.userID
    );

    if (!changeEmail.ok) {
      return res.json({ ok: false, message: changeEmail.message });
    } else {
      req.session.user_email = email;
      req.session.code = changeEmail.code;

      setTimeout(() => {
        delete req.session.code;
        delete req.session.user_email;
        req.session.save();
      }, 180000);

      res.json({ ok: true, message: "Code sent to your new email" });
    }
  } catch (error) {
    console.log(error);
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.post("/change_email_code", async (req, res) => {
  try {
    if (req.session.code) {
      if (req.session.code == req.body.code) {
        const { user_email } = req.session;

        await emailUpdate(user_email, req.session.userID);
        res.json({ ok: true, message: "Email updated" });
      } else {
        res.json({ ok: false, message: "Incorrect code" });
      }
    } else {
      res.json({ ok: false, message: "Verification may code expired" });
    }
  } catch (error) {
    console.log(error);
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.post("/change_password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (oldPassword == newPassword)
      return res.json({
        ok: false,
        message: "New password cannot be the same as the old one",
      });

    const changePassword = await changeUserPasswod(
      oldPassword,
      newPassword,
      req.session.userID
    );

    if (!changePassword.ok) {
      return res.json({ ok: false, message: changePassword.message });
    } else {
      res.json({ ok: true, message: changePassword.message });
    }
  } catch (error) {
    console.log(error);
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ ok: true, message: "Logout successful" });
});

router.delete("/delete_account", async (req, res) => {
  try {
    const userId = req.session.userID;

    const accountDeleted = await deleteUserAccount(userId);

    if (!accountDeleted.ok) {
      return res.json({ ok: false, message: accountDeleted.message });
    } else {
      req.session.destroy();
      res.json({ ok: true, message: accountDeleted.message });
    }
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.delete("/delete_post/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;

    await deletePost(post_id);
    res.json({ ok: true, message: "Post deleted" });
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.post("/email_forgot_password", async (req, res) => {
  try {
    const { email } = req.body;

    const forgotPassword = await sendChangePassCode(email);

    if (!forgotPassword.ok) {
      return res.json({ ok: false, message: forgotPassword.message });
    } else {
      req.session.code = forgotPassword.code;
      req.session.user_email = email;

      setTimeout(() => {
        delete req.session.code;
        delete req.session.user_email;
        req.session.save();
      }, [180000]);

      res.json({ ok: true });
    }
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.post("/code_password", async (req, res) => {
  try {
    const { code, password } = req.body;

    if (req.session.code) {
      if (req.session.code == code) {
        const changePassword = await changePassCode(
          req.session.user_email,
          password
        );

        if (!changePassword.ok)
          return res.json({ ok: false, message: changePassword.message });

        delete req.session.code;
        delete req.session.user_email;
        req.session.save();

        res.json({ ok: true, message: "Password changed successfully" });
      } else {
        res.json({ ok: false, message: "Code incorrect" });
      }
    } else {
      res.json({ ok: false, message: "Code may expired" });
    }
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/user_search/:search", async (req, res) => {
  try {
    const { search } = req.params;

    const searched = await usersSearch(search, req.session.userID);

    res.json({ users: searched });
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

router.get("/user_posts_by_word/:word", async (req, res) => {
  try {
    const { word } = req.params;

    const { posts } = await postsSearch(req.session.userID, word);
    res.json(posts);
  } catch (error) {
    console.log({ error });
    res.json({ ok: false, message: "Internal server error" });
  }
});

module.exports = router;
