const { Router } = require("express");
const {
  following,
  editTitle,
  likingPost,
  savingPost,
} = require("../../controllers/activities");
const activitiesRouter = Router();

activitiesRouter.post("/follow", following);
activitiesRouter.put("/edit/:post_id", editTitle);
activitiesRouter.post("/like", likingPost);
activitiesRouter.post("/save", savingPost);

module.exports = activitiesRouter;
