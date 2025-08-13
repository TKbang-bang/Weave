import axios from "axios";
import api from "./api.service";

export const getMyUser = async () => {
  const res = await api.get(`/users/me`);
  return res;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/user/${id}`);
  return res;
};

export const gettingFollowingUsers = async () => {
  const res = await api.get("/users/following");
  return res;
};
