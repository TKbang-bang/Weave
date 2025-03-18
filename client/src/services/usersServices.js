import api from "./apis/axios";

export const userVerify = async () => {
  const request = await api.get("/user_verify");

  return request;
};
