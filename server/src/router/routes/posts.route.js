const { Router } = require("express");
const {
  posting,
  gettingComments,
  gettingMyUserPosts,
  gettingUserPosts,
  deletingPost,
} = require("../../controllers/posts");
const upload = require("../../utils/multer");
const {
  getPosts,
  gettingSavedPosts,
  //   getPostsById,
} = require("../../controllers/bigPosts");
const postRouter = Router();

postRouter.post("/", upload.single("file"), posting);
postRouter.get("/", getPosts);
postRouter.get("/:postId/comments", gettingComments);
// postRouter.get("/post/:post_id", getPostsById);
postRouter.get("/me", gettingMyUserPosts);
postRouter.get("/user/:user_id", gettingUserPosts);
postRouter.get("/saved", gettingSavedPosts);
postRouter.delete("/:post_id", deletingPost);

module.exports = postRouter;
