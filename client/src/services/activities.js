import api from "./api.service";

export const editingTitle = async (id, title) => {
  const res = await api.put(`/edit_post/${id}`, { title });
  return res;
};

export const likingPost = async (id) => {
  const res = api.post("/like", { post_id: id });
  return res;
};

export const gettingComments = async (id) => {
  const res = await api.get(`/comments/${id}`);
  return res;
};

export const deletePost = async (post_id) => {
  const res = await api.delete("/delete_post/" + post_id);
  return res;
};

export const followConfig = async (userId) => {
  const res = await api.post("/follow", { userId });
  return res;
};

export const savingPost = async (postId) => {
  const res = await api.post("/save", { postId });
  return res;
};
