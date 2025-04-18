const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const http = require("http");
const myStore = require("./configs/session_store");
const router = require("./router/router");
const { mySocket } = require("./services/socket.services/socketService");
const errorHandler = require("./error/errorHandler");
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
    origin: `${process.env.CLIENT_URL}`,
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
    secret: `${process.env.MY_SECRET_KEY}`,
    store: myStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// ROUTES
app.use(router);

// ERROR HANDLER
app.use(errorHandler);

// STARTING SERVER
server.listen(app.get("port"), () => console.log("Server running"));
