const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const { Server } = require("socket.io");
const http = require("http");
const myStore = require("./configs/session_store");
const router = require("./router/router");
const db = require("./database/db");
const myDate = require("./configs/date_format");
const { format } = require("date-fns");
const { user } = require("./configs/database_config");
require("dotenv").config();

// STARTING APPLICATION
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// SETTERS
app.set("port", process.env.PORT || 3000);

// MIDDLEWARES
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// EXPRESS-SESSION MANAGEMENT
app.use(
  session({
    key: "session_cookie_name",
    secret: process.env.MY_SECRET_KEY,
    store: myStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// ROUTES
app.use(router);

// SOCKETS

io.on("connection", (socket) => {
  // console.log("a user connected");
  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });

  socket.on("client_comment", (data) => {
    const comment_id = crypto.randomUUID();

    const rq =
      "INSERT INTO comments (comment_id, post_id, user_id, comment_content) VALUES (?, ?, ?, ?)";

    db.query(
      rq,
      [comment_id, data.post_id, data.user_id, data.comment_content],
      (err, result) => {
        if (err) return res.json({ ok: false, message: "Server error" });

        const rq2 =
          "SELECT user_name, user_lastname, user_profile FROM users WHERE user_id = ? ";

        db.query(rq2, [data.user_id], (err, result) => {
          if (err) return res.json({ ok: false, message: "Server error" });

          const newComment = {
            comment_id: comment_id,
            comment_content: data.comment_content,
            user_name: result[0].user_name,
            user_lastname: result[0].user_lastname,
            user_profile: result[0].user_profile,
          };

          io.emit("server_comment", newComment);
        });
      }
    );
  });

  // socket.on("client_message", (data) => {
  //   const { from_user_id, to_user_id, message } = data;
  //   const dateFormat = "yyyy-MM-dd HH:mm:ss";
  //   const now = new Date();
  //   const date = format(now, dateFormat);
  //   const message_id = crypto.randomUUID();

  //   // Insertamos el mensaje en la base de datos
  //   const rq =
  //     "INSERT INTO messages (message_id, from_user_id, to_user_id, message_content, message_date) VALUES (?, ?, ?, ?, ?)";

  //   db.query(
  //     rq,
  //     [message_id, from_user_id, to_user_id, message, date],
  //     (err, result) => {
  //       if (err) return socket.emit("error", { message: "Server error" });

  //       // Creamos el objeto de mensaje
  //       const newMessage = {
  //         message_id: message_id,
  //         from_user_id: from_user_id,
  //         to_user_id: to_user_id,
  //         message_content: message,
  //         message_date: date,
  //       };

  //       io.emit("server_message", newMessage);
  //     }
  //   );
  // });
});

server.listen(app.get("port"), () => console.log("Server running"));
