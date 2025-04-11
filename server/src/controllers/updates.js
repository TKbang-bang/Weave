const ServerError = require("../error/errorClass");
const {
  changeProfilePicture,
  profilePictureDelete,
  changeUserName,
  changeUserAlias,
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

const changingName = async (req, res, next) => {
  try {
    // USER DATA
    const { name, password } = req.body;

    // CHANGING THE NAME
    const changeName = await changeUserName(name, password, req.session.userID);

    if (!changeName.ok)
      return next(
        new ServerError(changeName.message, "name changing", changeName.status)
      );

    res.status(200).json({ ok: true, message: "Name changed" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const changingAlias = async (req, res, next) => {
  try {
    // USER DATA
    const { alias, password } = req.body;

    // CHANGING THE NAME
    const changeAlias = await changeUserAlias(
      alias,
      password,
      req.session.userID
    );

    if (!changeAlias.ok)
      return next(
        new ServerError(
          changeAlias.message,
          "name changing",
          changeAlias.status
        )
      );

    res.status(200).json({ ok: true, message: "Alias changed successfully" });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = {
  changingUserProfilePicture,
  deletingProfilePicture,
  changingName,
  changingAlias,
};
