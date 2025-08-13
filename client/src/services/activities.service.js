import api from "./api.service";

export const editingTitle = async (id, title) => {
  const res = await api.put(`/activities/edit/${id}`, { title });
  return res;
};

export const likingPost = async (id) => {
  const res = api.post("/activities/like", { post_id: id });
  return res;
};

export const followConfig = async (userId) => {
  const res = await api.post("/activities/follow", { userId });
  return res;
};

export const savingPost = async (postId) => {
  const res = await api.post("/activities/save", { postId });
  return res;
};
