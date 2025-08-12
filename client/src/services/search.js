import api from "./api.service";

export const userSearching = async (search) => {
  const res = await api.get(`/user_search/${search}`);
  return res;
};

export const postSearching = async (word) => {
  const res = await api.get(`/posts_search_by_word/${word}`);
  return res;
};
