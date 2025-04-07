import axios from "axios";

export const registerData = async (name, alias, email, password) => {
  const res = await axios.post("/signup", { name, alias, email, password });
  return res;
};

export const codeVerify = async (code) => {
  const res = await axios.post("/verify", { code });
  return res;
};

export const loginData = async (email, password) => {
  const res = await axios.post("/login", { email, password });
  return res;
};
