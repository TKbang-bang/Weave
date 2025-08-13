import api from "./api.service";

export const gettingPosts = async ({ link }) => {
  const res = await api.get(`${link}`);
  return res;
};

export const postingPost = async ({ file, title, type }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("type", type);

  const res = await api.post("/posts", formData);
  return res;
};

export const gettingComments = async (id) => {
  const res = await api.get(`/posts/${id}/comments`);
  return res;
};

export const deletePost = async (post_id) => {
  const res = await api.delete(`/posts/${post_id}`);
  return res;
};
