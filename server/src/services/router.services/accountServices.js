const { User } = require("../../../models");

const deleteUserAccount = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return { ok: false, message: "User not found", status: 404 };

    await user.destroy();

    return { ok: true, message: "Account deleted" };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { deleteUserAccount };
