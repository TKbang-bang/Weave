const { Like } = require("../../../models");

const liking = async (userId, postId) => {
  try {
    const like = await Like.findOne({
      where: { userId, postId },
    });

    if (like) {
      await like.destroy();
      return { liking: false };
    } else {
      await Like.create({ userId, postId });
      return { liking: true };
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { liking };
