import axios from "axios";
import api from "./api.service";

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

export const loginOut = async () => {
  const res = await api.get("/logout");
  return res;
};

export const deleteAccount = async () => {
  const res = await api.delete("/delete_account");
  return res;
};

export const forgotPassword = async (email) => {
  const res = await api.post("/email_forgot_password", { email });
  return res;
};

export const changePassCode = async (code, password) => {
  const res = await api.post("/code_email_forgot_password", {
    code,
    password,
  });
  return res;
};
