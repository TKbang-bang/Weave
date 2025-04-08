import axios from "axios";

export const editingTitle = async (id, title) => {
  const res = await axios.put(`/edit_post/${id}`, { title });
  return res;
};

export const likingPost = async (id) => {
  const res = axios.post("/like", { post_id: id });
  return res;
};

export const gettingComments = async (id) => {
  const res = await axios.get(`/comments/${id}`);
  return res;
};
