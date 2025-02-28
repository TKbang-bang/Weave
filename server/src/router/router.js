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
  if (req.session.userID) {
    res.send({ ok: true });
  } else {
    res.send({ ok: false });
  }
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
    "SELECT post_id, post_title, post_content, post_date, p.user_id, user_name, user_lastname, user_profile,(SELECT COUNT(*) follow_id FROM follows WHERE from_user_id = ? AND to_user_id = u.user_id) as followed, (SELECT COUNT(*) like_id FROM likes WHERE post_id = p.post_id) as likes, (SELECT COUNT(*) like_id FROM likes WHERE user_id = ? AND post_id = p.post_id) as liked , (SELECT COUNT(*) comment_id FROM comments WHERE user_id = ? AND post_id = p.post_id) as comments FROM posts p JOIN users u ON u.user_id = p.user_id ORDER BY post_date DESC";

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
        };
      });

      res.json(newPosts);
    }
  );
});

module.exports = router;
