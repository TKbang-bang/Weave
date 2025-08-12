const db = require("../../database/db");
const { Follows } = require("../../../models");

const setFollow = async (fromUser, toUser) => {
  try {
    const follow = await Follows.findOne({
      where: {
        fromUser,
        toUser,
      },
    });

    // un/following
    if (follow) {
      await follow.destroy();
      return false;
    } else {
      await Follows.create({
        fromUser,
        toUser,
      });
      return true;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = { setFollow };
