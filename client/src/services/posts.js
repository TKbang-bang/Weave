import axios from "axios";

export const gettingPosts = async ({ link }) => {
  const res = await axios.get(`${link}`);
  return res;
};
