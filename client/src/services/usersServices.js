import axios from "axios";

export const getUserId = async () => {
  const res = await axios.get("/user_id");
  return res;
};

export const getMyUser = async () => {
  const res = await axios.get(`/user`);
  return res;
};

export const getUserById = async (id) => {
  const res = await axios.get(`/user_/${id}`);
  return res;
};
