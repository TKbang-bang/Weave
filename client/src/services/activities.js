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

export const deletePost = async (post_id) => {
  const res = await axios.delete("/delete_post/" + post_id);
  return res;
};

export const followConfig = async (user_id) => {
  const res = await axios.post("/follow", { user_id });
  return res;
};

export const savingPost = async (post_id) => {
  const res = await axios.post("/save", { post_id });
  return res;
};
