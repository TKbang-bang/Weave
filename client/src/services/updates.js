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
