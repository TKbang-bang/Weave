const jwt = require("jsonwebtoken");

const createAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

const refreshTokenOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 30,
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  refreshTokenOptions,
};
