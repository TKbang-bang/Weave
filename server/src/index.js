const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const { Server } = require("socket.io");
const http = require("http");
const myStore = require("./configs/session_store");
const router = require("./router/router");
require("dotenv").config();

// STARTING APPLICATION
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(app.get("port"), () => console.log("Server running"));
