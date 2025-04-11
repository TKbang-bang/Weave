import axios from "axios";

export const changingProfilePicture = async (file) => {
  const res = await axios.post("/change_profile_picture", file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const deletingProfilePicture = async () => {
  const res = await axios.delete("/delete_profile_picture");
  return res;
};

export const changingName = async (name, password) => {
  const res = await axios.post("/change_name", {
    name,
    password,
  });

  return res;
};

export const changingAlias = async (alias, password) => {
  const res = await axios.post("/change_alias", {
    alias,
    password,
  });

  return res;
};
