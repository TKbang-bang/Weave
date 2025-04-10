const ServerError = require("../error/errorClass");
const {
  changeProfilePicture,
  profilePictureDelete,
} = require("../services/router.services/updateServices");

const changingUserProfilePicture = async (req, res, next) => {
  try {
    const { filename } = req.file;

    // CHANGING THE PROFILE PICTURE
    const profileUpdate = await changeProfilePicture(
      filename,
      req.session.userID
    );

    if (!profileUpdate) {
      return next(
        new ServerError("Something went wrong", "profile picture", 500)
      );
    }

    res.status(200).json({ ok: true, message: "Profile picture updated" });
  } catch (error) {
    console.log(error);
    return next(new ServerError(error.message, "server", 500));
  }
};

const deletingProfilePicture = async (req, res, next) => {
  try {
    const deleted = await profilePictureDelete(req.session.userID);

    if (!deleted)
      return next(
        new ServerError(deleted.message, "profile delete", deleted.status)
      );

    res.status(200).json({ ok: true, message: "Profile picture deleted" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { changingUserProfilePicture, deletingProfilePicture };
