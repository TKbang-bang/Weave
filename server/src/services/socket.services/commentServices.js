const { Comment, User } = require("../../../models");
const jwt = require("jsonwebtoken");
const myDate = require("../../configs/date_format");

async function addComment(data, socket) {
  try {
    const { userId } = jwt.verify(data.token, process.env.ACCESS_TOKEN_SECRET);

    if (!userId)
      return socket.emit("server_error", { message: "Invalid token" });

    const { dataValues } = await Comment.create({
      content: data.content,
      postId: data.postId,
      userId,
    });

    console.log("comment => ", dataValues);

    const comment = await Comment.findOne({
      where: { id: dataValues.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "alias", "profile"],
        },
      ],
    });
    const date = myDate(comment.createdAt);
    comment.dataValues.since_date = date;

    return socket.emit("server_comment", comment.toJSON());
  } catch (error) {
    console.log("error b => ", error);
    return socket.emit("server_error", { message: "Internal server error" });
  }
}

module.exports = { addComment };
