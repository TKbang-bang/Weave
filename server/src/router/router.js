const express = require("express");
const db = require("../database/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randToken = require("rand-token");
const upload = require("../configs/multer");
const { format } = require("date-fns");
const myDate = require("../configs/date_format");

const router = express.Router();

router.get("/user_verify", (req, res) => {
  const rq = "SELECT user_id FROM users WHERE user_id = ?";

  db.query(rq, [req.session.userID], (err, result) => {
    if (err) {
      return res.json({ ok: false, message: "Server error" });
    }

    if (result.length > 0) {
      return res.json({ ok: true });
    } else {
      return res.json({ ok: false, message: "User not found" });
    }
  });
});

router.post("/signup", async (req, res) => {
  const { name, lastname, email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE user_email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.json({ ok: false, message: "Server error" });
      }

      if (result.length > 0) {
        return res.send({ ok: false, message: "User already exists" });
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const userId = crypto.randomUUID();
        const code = await randToken.generate(7);

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
            res.json({ ok: false, message: "Something went wrong\nTry again" });
          } else {
            if (info.accepted) {
              //  CREATING A SESSION VARIABLE TO SAVE THE CREDENTIALS AND THE CODE
              req.session.nextUser = {
                name,
                lastname,
                email,
                password: hashPassword,
                userID: userId,
              };
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
      }
    }
  );
});

router.post("/verify", async (req, res) => {
  const { code } = req.body;

  if (req.session.code) {
    if (req.session.code == code) {
      const { name, lastname, email, password, userID } = req.session.nextUser;

      db.query(
        "INSERT INTO users (user_name, user_lastname, user_email, user_password, user_id) VALUES (?,?,?,?,?)",
        [name, lastname, email, password, userID],
        (err, result) => {
          if (err) {
            return res.json({ ok: false, message: "Server error" });
          }

          req.session.userID = userID;
          req.session.save();
          res.send({ ok: true });

          delete req.session.code;
          delete req.session.nextUser;
          req.session.save();
        }
      );
    } else {
      res.send({ ok: false, message: "Wrong code" });
    }
  } else {
    res.json({ ok: false, message: "Verification code expired" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE user_email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.json({ ok: false, message: "Server error" });
      }

      if (result.length > 0) {
        const user = result[0];
        const validPassword = await bcrypt.compare(
          password,
          user.user_password
        );

        if (validPassword) {
          req.session.userID = user.user_id;
          req.session.save();
          res.send({ ok: true });
        } else {
          res.send({ ok: false, message: "Wrong password" });
        }
      } else {
        res.send({ ok: false, message: "User not found" });
      }
    }
  );
});

router.post("/publicate", upload.single("file"), (req, res) => {
  const { title } = req.body;
  const file = req.file.filename;

  const now = new Date();
  const date = format(now, "yyyy-MM-dd HH:mm:ss");
  // const post_id = crypto.randomUUID()

  const rq =
    "INSERT INTO posts (post_id, post_title, post_content, post_date, user_id) VALUES (?)";

  db.query(
    rq,
    [[crypto.randomUUID(), title, file, date, req.session.userID]],
    (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      res.json({ ok: true });
    }
  );
});

router.get("/posts", (req, res) => {
  const rq =
    "SELECT post_id, post_title, post_content, post_date, p.user_id, user_name, user_lastname, user_profile,(SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = u.user_id) as followed, (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes, (SELECT COUNT(*) FROM likes WHERE user_id = ? AND post_id = p.post_id) as liked , (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments FROM posts p JOIN users u ON u.user_id = p.user_id ORDER BY post_date DESC";

  db.query(
    rq,
    [req.session.userID, req.session.userID, req.session.userID],
    (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      const dateFormat = "yyyy-MM-dd HH:mm:ss";
      const today = new Date();

      const newPosts = result.map((post) => {
        return {
          ...post,
          since_date: myDate(post.post_date, today, dateFormat),
          me: post.user_id == req.session.userID ? true : false,
          comment_section: false,
        };
      });

      res.json(newPosts);
    }
  );
});

router.post("/follow", (req, res) => {
  const { user_id } = req.body;
  const rq =
    "SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = ?";

  db.query(rq, [req.session.userID, user_id], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    if (result[0]["COUNT(*)"] == 0) {
      const rq =
        "INSERT INTO follows (follow_id, from_user_id, to_user_id) VALUES (?, ?, ?)";

      db.query(
        rq,
        [crypto.randomUUID(), req.session.userID, user_id],
        (err, result) => {
          if (err) return res.json({ ok: false, message: "Server error" });

          res.json({ ok: true, followed: true });
        }
      );
    } else {
      const rq =
        "DELETE FROM follows WHERE from_user_id = ? AND to_user_id = ?";

      db.query(rq, [req.session.userID, user_id], (err, result) => {
        if (err) return res.json({ ok: false, message: "Server error" });

        res.json({ ok: true, followed: false });
      });
    }
  });
});

router.post("/edit_post", (req, res) => {
  const { post_id, post_title } = req.body;

  const rq = "UPDATE posts SET post_title = ? WHERE post_id = ?";

  db.query(rq, [post_title, post_id], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    res.json({ ok: true });
  });
});

router.post("/like", (req, res) => {
  const { post_id } = req.body;

  const rq = "SELECT COUNT(*) FROM likes WHERE user_id = ? AND post_id = ?";

  db.query(rq, [req.session.userID, post_id], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    if (result[0]["COUNT(*)"] == 0) {
      const rq =
        "INSERT INTO likes (like_id, user_id, post_id) VALUES (?, ?, ?)";

      db.query(
        rq,
        [crypto.randomUUID(), req.session.userID, post_id],
        (err, result) => {
          if (err) return res.json({ ok: false, message: "Server error" });

          res.json({ ok: true, liked: true });
        }
      );
    } else {
      const rq = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";

      db.query(rq, [req.session.userID, post_id], (err, result) => {
        if (err) return res.json({ ok: false, message: "Server error" });

        res.json({ ok: true, liked: false });
      });
    }
  });
});

router.get("/post/:post_id", (req, res) => {
  const { post_id } = req.params;

  // const rq =
  //   "SELECT post_id, post_title, post_content, post_date, p.user_id, user_name, user_lastname, user_profile,(SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = u.user_id) as followed, (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes, (SELECT COUNT(*) FROM likes WHERE user_id = ? AND post_id = p.post_id) as liked , (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments FROM posts p JOIN users u ON u.user_id = p.user_id WHERE p.post_id = ? ORDER BY post_date DESC";

  const rq =
    "SELECT post_id, post_title, post_content, post_date, p.user_id, user_name, user_lastname, user_profile, (SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = u.user_id) as followed, (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes, (SELECT COUNT(*) FROM likes WHERE user_id = ? AND post_id = p.post_id) as liked , (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments FROM posts p JOIN users u ON u.user_id = p.user_id WHERE p.post_id = ? ORDER BY post_date DESC";

  db.query(
    rq,
    [req.session.userID, req.session.userID, post_id],
    (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      if (result.length > 0) {
        const dateFormat = "yyyy-MM-dd HH:mm:ss";
        const today = new Date();

        const rq2 =
          "SELECT comment_id, comment_content, post_id, user_name, user_lastname, user_profile FROM comments c JOIN users u ON u.user_id = c.user_id WHERE post_id = ? ";

        db.query(rq2, [post_id], (err, data) => {
          if (err) return res.json({ ok: false, message: "Server error" });

          const newPosts = result.map((post) => {
            return {
              ...post,
              since_date: myDate(post.post_date, today, dateFormat),
              me: post.user_id == req.session.userID ? true : false,
              comment_section: true,
              allComments: data,
            };
          });

          res.json(newPosts);
        });
      } else {
        res.json({ ok: false, message: "Post not found" });
      }
    }
  );
});

router.get("/user_id", (req, res) => {
  res.json({ ok: true, user_id: req.session.userID });
});

router.get("/user", (req, res) => {
  const rq =
    "SELECT user_name, user_lastname, user_profile, (SELECT COUNT(*) FROM follows WHERE to_user_id = ?) AS followers FROM users WHERE user_id = ?";

  db.query(rq, [req.session.userID, req.session.userID], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    if (result.length > 0) {
      res.json({ ok: true, user: result[0] });
    } else {
      res.json({ ok: false, message: "User not found" });
    }
  });
});

router.get("/user_posts", (req, res) => {
  const rq =
    "SELECT post_id, post_title, post_content, post_date, p.user_id, user_name, user_lastname, user_profile,(SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = u.user_id) as followed, (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes, (SELECT COUNT(*) FROM likes WHERE user_id = ? AND post_id = p.post_id) as liked , (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments FROM posts p JOIN users u ON u.user_id = p.user_id WHERE p.user_id = ? ORDER BY post_date DESC";

  db.query(
    rq,
    [
      req.session.userID,
      req.session.userID,
      req.session.userID,
      req.session.userID,
    ],
    (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      const dateFormat = "yyyy-MM-dd HH:mm:ss";
      const today = new Date();

      const newPosts = result.map((post) => {
        return {
          ...post,
          since_date: myDate(post.post_date, today, dateFormat),
          me: post.user_id == req.session.userID ? true : false,
          comment_section: false,
        };
      });

      res.json(newPosts);
    }
  );
});

router.get("/user_/:user_id", (req, res) => {
  const { user_id } = req.params;

  const rq =
    "SELECT user_name, user_lastname, user_profile, (SELECT COUNT(*) FROM follows WHERE to_user_id = ?) AS followers, (SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = ?) AS followed FROM users WHERE user_id = ?";

  db.query(
    rq,
    [user_id, req.session.userID, user_id, user_id],
    (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      if (result.length > 0) {
        res.json({ ok: true, user: result[0] });
      } else {
        res.json({ ok: false, message: "User not found" });
      }
    }
  );
});

router.get("/user_posts_/:user_id", (req, res) => {
  const { user_id } = req.params;

  const rq =
    "SELECT post_id, post_title, post_content, post_date, p.user_id, user_name, user_lastname, user_profile,(SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = u.user_id) as followed, (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes, (SELECT COUNT(*) like_id FROM likes WHERE user_id = ? AND post_id = p.post_id) as liked , (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments FROM posts p JOIN users u ON u.user_id = p.user_id WHERE p.user_id = ? ORDER BY post_date DESC";

  db.query(
    rq,
    [req.session.userID, req.session.userID, user_id, user_id],
    (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      const dateFormat = "yyyy-MM-dd HH:mm:ss";
      const today = new Date();

      const newPosts = result.map((post) => {
        return {
          ...post,
          since_date: myDate(post.post_date, today, dateFormat),
          me: post.user_id == req.session.userID ? true : false,
          comment_section: false,
        };
      });

      res.json(newPosts);
    }
  );
});

// router.get("/user_search/:user_name", (req, res) => {
//   const { user_name } = req.params;

//   const rq =
//     "SELECT user_id, user_name, user_lastname, user_profile FROM users WHERE user_name LIKE ? OR user_lastname LIKE ?";

//   db.query(rq, [`${user_name}%`, `${user_name}%`], (err, result) => {
//     if (err) return res.json({ ok: false, message: "Server error" });

//     if (result.length > 0) {
//       const newUsers = result.filter(
//         (user) => user.user_id != req.session.userID
//       );
//       res.json({ ok: true, users: newUsers });
//     } else {
//       res.json({ ok: false, message: "User not found" });
//     }
//   });
// });

router.get("/mychats", (req, res) => {
  const rq =
    "SELECT * FROM users JOIN messages m ON m.from_user_id = ? OR m.to_user_id = ?";

  db.query(rq, [req.session.userID, req.session.userID], (err, result) => {
    if (err) console.log(err); //return res.json({ ok: false, message: "Server error" });

    if (result.length > 0) {
      res.json({ ok: true, users: result });
    } else {
      res.json({ ok: false, message: "You have no chats" });
    }
  });
});

router.get("/mychats/:user_id", (req, res) => {
  const { user_id } = req.params;

  const rq =
    "SELECT user_name, user_lastname, user_profile FROM users WHERE user_id = ?";

  db.query(rq, [user_id], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    if (result.length > 0) {
      // res.json({ ok: true, user: result[0] });
      const rq2 =
        "SELECT * FROM messages WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?) ORDER BY message_date DESC";
      db.query(
        rq2,
        [req.session.userID, user_id, user_id, req.session.userID],
        (err, result2) => {
          if (err) return res.json({ ok: false, message: "Server error" });

          if (result2.length > 0) {
            res.json({ ok: true, user: result[0], messages: result2 });
          } else {
            res.json({
              ok: true,
              user: result[0],
              message: "No chats with this user",
            });
          }
        }
      );
    } else {
      res.json({ ok: false, message: "User not found" });
    }
  });
});

router.get("/user_profile", (req, res) => {
  const rq =
    "SELECT user_name, user_lastname, user_profile FROM users WHERE user_id = ?";

  db.query(rq, [req.session.userID], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });
    res.json({ ok: true, user: result[0] });
  });
});

router.post("/change_profile_picture", upload.single("file"), (req, res) => {
  const { filename } = req.file;

  const rq = "UPDATE users SET user_profile = ? WHERE user_id = ?";

  db.query(rq, [filename, req.session.userID], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });
    res.json({ ok: true, message: "Profile picture changed" });
  });
});

router.post("/change_name", (req, res) => {
  const { name, lastname, password } = req.body;

  const rq = "SELECT user_password FROM users WHERE user_id = ?";

  db.query(rq, [req.session.userID], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    bcrypt.compare(password, result[0].user_password, (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      if (result) {
        const rq =
          "UPDATE users SET user_name = ?, user_lastname = ? WHERE user_id = ?";

        db.query(rq, [name, lastname, req.session.userID], (err, result) => {
          if (err) return res.json({ ok: false, message: "Server error" });
          res.json({ ok: true, message: "Name changed" });
        });
      } else {
        res.json({ ok: false, message: "Incorrect password" });
      }
    });
  });
});

router.post("/change_email", (req, res) => {
  const { email, password } = req.body;

  const rq = "SELECT user_password FROM users WHERE user_id = ?";

  db.query(rq, [req.session.userID], (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    bcrypt.compare(password, result[0].user_password, (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      if (result) {
        const rq = "SELECT user_email FROM users WHERE user_email = ?";

        db.query(rq, [email], async (err, result) => {
          if (err) return res.json({ ok: false, message: "Server error" });

          if (result.length > 0) {
            res.json({ ok: false, message: "Email already in use" });
          } else {
            const code = await randToken.generate(7);

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
                res.json({
                  ok: false,
                  message: "Something went wrong\nTry again",
                });
              } else {
                if (info.accepted) {
                  //  CREATING A SESSION VARIABLE TO SAVE THE CREDENTIALS AND THE CODE
                  req.session.user_email = email;
                  req.session.code = code;
                  res.json({ ok: true });

                  //  DELETING THE CODE AFTER THREE MINUTES
                  setTimeout(() => {
                    delete req.session.code;
                    delete req.session.user_email;
                    req.session.save();
                  }, 180000);
                } else {
                  //  IF THERE WHERE NO ERROR BUT THE EMAIL WAS NOT SENT
                  res.json({ ok: false, message: "Email not found" });
                }
              }
            });
          }
        });
      } else {
        res.json({ ok: false, message: "Incorrect password" });
      }
    });
  });
});

router.post("/change_email_code", (req, res) => {
  if (req.session.code) {
    if (req.session.code == req.body.code) {
      const { user_email } = req.session;

      const rq = "UPDATE users SET user_email = ? WHERE user_id = ?";

      db.query(rq, [user_email, req.session.userID], (err, result) => {
        if (err) return res.json({ ok: false, message: "Server error" });
        res.json({ ok: true, message: "Email changed" });
      });

      delete req.session.code;
      delete req.session.user_email;
      req.session.save();
    } else {
      res.json({ ok: false, message: "Incorrect code" });
    }
  } else {
    res.json({ ok: false, message: "Verification code expired" });
  }
});

router.post("/change_password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const rq = "SELECT user_password FROM users WHERE user_id = ?";

  db.query(rq, [req.session.userID], async (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    const validPassword = await bcrypt.compare(
      oldPassword,
      result[0].user_password
    );

    if (validPassword) {
      bcrypt.compare(
        newPassword,
        result[0].user_password,
        async (err, result) => {
          if (err) return res.json({ ok: false, message: "Server error" });

          if (result) {
            res.json({
              ok: false,
              message: "New password is the same as the old one",
            });
          } else {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);

            const rq = "UPDATE users SET user_password = ? WHERE user_id = ?";

            db.query(rq, [hashPassword, req.session.userID], (err, result) => {
              if (err) return res.json({ ok: false, message: "Server error" });
              res.json({ ok: true, message: "Password changed" });
            });
          }
        }
      );
    } else {
      res.json({ ok: false, message: "Incorrect password" });
    }
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

router.delete("/delete_account", async (req, res) => {
  const userId = req.session.userID;

  try {
    await db.promise().beginTransaction();

    // Eliminar registros relacionados en las distintas tablas
    await db.promise().query("DELETE FROM users WHERE user_id = ?", [userId]);
    await db
      .promise()
      .query("DELETE FROM follows WHERE from_user_id = ? OR to_user_id = ?", [
        userId,
        userId,
      ]);
    await db.promise().query("DELETE FROM posts WHERE user_id = ?", [userId]);
    await db
      .promise()
      .query("DELETE FROM comments WHERE user_id = ?", [userId]);
    await db.promise().query("DELETE FROM likes WHERE user_id = ?", [userId]);

    // Confirmar la transacción si todo sale bien
    await db.promise().commit();

    // Destruir la sesión del usuario
    req.session.destroy();

    // Enviar respuesta de éxito
    res.json({ ok: true });
  } catch (err) {
    // Hacer rollback si ocurre un error
    await db.promise().rollback();
    console.log(err);
    res.json({ ok: false, message: "Server error" });
  }
});

router.delete("/delete_post/:post_id", async (req, res) => {
  const { post_id } = req.params;

  try {
    await db.promise().beginTransaction();

    // Eliminar registros relacionados en las distintas tablas
    await db.promise().query("DELETE FROM posts WHERE post_id = ?", [post_id]);
    await db.promise().query("DELETE FROM likes WHERE post_id = ?", [post_id]);
    await db
      .promise()
      .query("DELETE FROM comments WHERE post_id = ?", [post_id]);

    // Confirmar la transacción si todo sale bien
    await db.promise().commit();

    // Enviar respuesta de éxito
    res.json({ ok: true });
  } catch (error) {
    await db.promise().rollback();
    console.log(error);
    res.json({ ok: false, message: "Server error" });
  }
});

router.post("/email_forgot_password", (req, res) => {
  const { email } = req.body;

  const rq = "SELECT COUNT(*) FROM users WHERE user_email = ?";

  db.query(rq, [email], async (err, result) => {
    if (err) return res.json({ ok: false, message: "Server error" });

    if (result[0]["COUNT(*)"] > 0) {
      const code = await randToken.generate(7);

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
          res.json({ ok: false, message: "Something went wrong\nTry again" });
        } else {
          if (info.accepted) {
            req.session.code = code;
            req.session.user_email = email;
            res.json({ ok: true });

            //  DELETING THE CODE AFTER THREE MINUTES
            setTimeout(() => {
              delete req.session.code;
              delete req.session.user_email;
              req.session.save();
            }, 180000);
          } else {
            //  IF THERE WHERE NO ERROR BUT THE EMAIL WAS NOT SENT
            res.json({ ok: false, message: "Email not found" });
          }
        }
      });
    } else {
      res.json({ ok: false, message: "User not found" });
    }
  });
});

router.post("/code_password", (req, res) => {
  const { code, password } = req.body;

  if (req.session.code) {
    if (req.session.code == code) {
      const rq = "UPDATE users SET user_password = ? WHERE user_email = ?";

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      db.query(rq, [hashPassword, req.session.user_email], (err, result) => {
        if (err) return res.json({ ok: false, message: "Server error" });

        res.json({ ok: true });

        delete req.session.code;
        delete req.session.user_email;
        req.session.save();
      });
    } else {
      res.json({ ok: false, message: "Code incorrect" });
    }
  } else {
    res.json({ ok: false, message: "Code may expired" });
  }
});

router.get("/user_search/:search", (req, res) => {
  const { search } = req.params;

  const rq =
    "SELECT user_id, user_name, user_lastname, user_profile FROM users WHERE (user_name LIKE ? OR user_lastname LIKE ?) AND user_id != ?";

  db.query(
    rq,
    [`${search}%`, `${search}%`, req.session.userID],
    (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      res.json({ users: result });
    }
  );
});

router.get("/user_posts_by_word/:word", (req, res) => {
  const { word } = req.params;

  const rq =
    "SELECT post_id, post_title, post_content, post_date, p.user_id, user_name, user_lastname, user_profile,(SELECT COUNT(*) FROM follows WHERE from_user_id = ? AND to_user_id = u.user_id) as followed, (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as likes, (SELECT COUNT(*) like_id FROM likes WHERE user_id = ? AND post_id = p.post_id) as liked , (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments FROM posts p JOIN users u ON u.user_id = p.user_id WHERE post_title LIKE ? ORDER BY post_date DESC";

  db.query(
    rq,
    [req.session.userID, req.session.userID, `%${word}%`],
    (err, result) => {
      if (err) return res.json({ ok: false, message: "Server error" });

      const dateFormat = "yyyy-MM-dd HH:mm:ss";
      const today = new Date();

      const newPosts = result.map((post) => {
        return {
          ...post,
          since_date: myDate(post.post_date, today, dateFormat),
          me: post.user_id == req.session.userID ? true : false,
          comment_section: false,
        };
      });

      res.json(newPosts);
    }
  );
});

module.exports = router;
