import api from "./api.service";

let accessToken = null;

export const setAccessToken = (token) => (accessToken = token);
export const getAccessToken = () => accessToken;
export const removeAccessToken = () => (accessToken = null);

export const verifyToken = async () => {
  const res = await api.get("/verifyToken");
  setAccessToken(res.headers["access-token"]);
  return res;
};
