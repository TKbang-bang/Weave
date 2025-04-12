import axios from "axios";

export const userSearching = async (search) => {
  const res = await axios.get(`/user_search/${search}`);
  return res;
};

export const postSearching = async (word) => {
  const res = await axios.get(`/posts_search_by_word/${word}`);
  return res;
};
