require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const router = require("./router/router");
const { mySocket } = require("./services/socket.services/socketService");
const errorHandler = require("./error/errorHandler");
const cookieParser = require("cookie-parser");

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
    exposedHeaders: ["access-token"],
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

// ROUTES
app.use(router);

// ERROR HANDLER
app.use(errorHandler);

// STARTING SERVER
server.listen(app.get("port"), () => console.log("Server running"));
