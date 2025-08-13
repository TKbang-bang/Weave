const { Router } = require("express");
const { userSearching, postSearching } = require("../../controllers/search");
const searchRouter = Router();

searchRouter.get("/user/:search", userSearching);
searchRouter.get("/posts/:search", postSearching);

module.exports = searchRouter;
