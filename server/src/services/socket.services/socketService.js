const { Server } = require("socket.io");
const commentService = require("./commentServices");

function mySocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // console.log("User connected");

    socket.on("client_comment", async (data) => {
      try {
        const newComment = await commentService.addComment(data);
        io.emit("server_comment", newComment);
      } catch (error) {
        console.error("Socket error:", error);
        socket.emit("server_error", { message: "Server error" });
      }
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });

  return io;
}

module.exports = { mySocket };
