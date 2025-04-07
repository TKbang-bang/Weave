const ServerError = require("../error/errorClass");
const { emialSend } = require("../services/router.services/accountServices");
const {
  getUserByEmail,
  createUser,
  getUserId,
  getUserByAlias,
} = require("../services/router.services/userServices");
const bcrypt = require("bcrypt");

const userIsLogged = async (req, res, next) => {
  try {
    if (!req.session.userID)
      return next(new ServerError("User is not logged", "auth", 401));

    const gettingUserId = await getUserId(req.session.userID);
    if (!gettingUserId)
      return next(new ServerError("User not found", "auth", 404));

    return res.status(204).json({ ok: true, message: "User is logged" });
  } catch (error) {
    next(new ServerError(error.message, "server", 500));
  }

  // console.log(req.session.userID);
};

const signup = async (req, res, next) => {
  try {
    // USER DATA
    const { name, alias, email, password } = req.body;

    // CHECKING IF THE USER ALREADY EXISTS
    const userByEmail = await getUserByEmail(email);

    if (userByEmail)
      return next(new ServerError("Email already registered", "email", 409));

    const userByAlias = await getUserByAlias(alias);

    if (userByAlias)
      return next(new ServerError("Alias already registered", "alias", 409));

    // SENDING A VERIFY CODE TO THE USER EMAIL
    const sendMail = await emialSend(email);

    if (!sendMail.ok)
      return next(new ServerError(sendMail.message, "email", 500));

    // CREATING A USER VARIABLE IN THE SERVER TEMPORARY
    req.session.nextUser = { name, alias, email, password };
    // SAVING THE CODE TEMPORARY IN THE SERVER
    req.session.code = sendMail.code;
    req.session.save();

    res.status(201).json({ ok: true });

    // DELETING THE USER VARIABLE AND THE CODE IN 30 MINS
    setTimeout(() => {
      delete req.session.nextUser;
      delete req.session.code;
      req.session.save();
    }, [180000]);
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const verify = async (req, res, next) => {
  try {
    // CODE FORM USER
    const { code } = req.body;

    // VERIFYING THE CODE
    if (!req.session.code)
      return next(new ServerError("Code may expired", "session", 400));

    if (req.session.code != code)
      return next(new ServerError("The code is incorrect", "code", 400));

    // TAKING THE USER DATA FROM THE TEMPORARY SESSION VARIABLE
    const { name, alias, email, password } = req.session.nextUser;

    // CREATING THE USER
    const ceratingUser = await createUser(name, alias, email, password);

    // SAVING THE USER ID IN THE SESSION
    req.session.userID = ceratingUser;
    req.session.save();

    res.status(201).json({ ok: true });

    // DELETING THE USER VARIABLE AND THE CODE
    delete req.session.code;
    delete req.session.nextUser;
    req.session.save();
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

const login = async (req, res, next) => {
  try {
    // USER DATA
    const { email, password } = req.body;

    // CHECKING IF THE USER EXISTS
    const user = await getUserByEmail(email);
    if (!user) return next(new ServerError("Email not found", "email", 404));

    // CHECKING THE PASSWORD
    const validPassword = await bcrypt.compare(password, user.user_password);

    if (!validPassword)
      return next(new ServerError("Wrong password", "password", 400));

    // SAVING THE USER ID IN THE SESSION
    req.session.userID = user.user_id;
    req.session.save();

    res.status(201).json({ ok: true });
  } catch (error) {
    return next(new ServerError(error.message, "server", 500));
  }
};

module.exports = { signup, verify, login, userIsLogged };
