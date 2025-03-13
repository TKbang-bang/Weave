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
const { mySocket } = require("./services/socket.services/socketService");
require("dotenv").config();

// STARTING APPLICATION
const app = express();
const server = http.createServer(app);
mySocket(server);

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

server.listen(app.get("port"), () => console.log("Server running"));
