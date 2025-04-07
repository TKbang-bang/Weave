import axios from "axios";

export const gettingPosts = async ({ link }) => {
  const res = await axios.get(`${link}`);
  return res;
};

export const postingPost = async ({ file, title, type }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("type", type);

  const res = await axios.post("/publicate", formData);
  return res;
};
