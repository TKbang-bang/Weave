import axios from "axios";
import api from "./api.service";

export const getMyUser = async () => {
  const res = await api.get(`/user`);
  return res;
};

export const getUserById = async (id) => {
  const res = await api.get(`/user_/${id}`);
  return res;
};

export const gettingFollowingUsers = async () => {
  const res = await api.get("/user_following");
  return res;
};
