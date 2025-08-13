import axios from "axios";
import api from "./api.service";

export const registerData = async (name, alias, email, password) => {
  const res = await axios.post("/auth/signup", {
    name,
    alias,
    email,
    password,
  });
  return res;
};

export const codeVerify = async (code) => {
  const res = await axios.post("/auth/verify", { code });
  return res;
};

export const loginData = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  return res;
};

export const loginOut = async () => {
  const res = await api.get("/session/logout");
  return res;
};

export const deleteAccount = async () => {
  const res = await api.delete("/session/account");
  return res;
};

export const forgotPassword = async (email) => {
  const res = await axios.post("/auth/password", { email });
  return res;
};

export const changePassCode = async (code, password) => {
  const res = await axios.post("/auth/password/code", {
    code,
    password,
  });
  return res;
};
