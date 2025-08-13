import api from "./api.service";

export const userSearching = async (search) => {
  const res = await api.get(`/search/user/${search}`);
  return res;
};

export const postSearching = async (word) => {
  const res = await api.get(`/search/posts/${word}`);
  return res;
};
