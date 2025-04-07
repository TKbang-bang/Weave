const ServerError = require("../error/errorClass");
const { createPost } = require("../services/router.services/postServices");

const posting = async (req, res, next) => {
  try {
    // POST DATA
    const { title, type } = req.body;
    const file = req.file.filename;

    // CREATING THE POST
    await createPost(title, file, type, req.session.userID);

    res.status(201).json({ ok: true, message: "Post created" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { posting };
