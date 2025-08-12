import api from "./api.service";

export const changingProfilePicture = async (file) => {
  const res = await api.post("/change_profile_picture", file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const deletingProfilePicture = async () => {
  const res = await api.delete("/delete_profile_picture");
  return res;
};

export const changingName = async (name, password) => {
  const res = await api.post("/change_name", {
    name,
    password,
  });

  return res;
};

export const changingAlias = async (alias, password) => {
  const res = await api.post("/change_alias", {
    alias,
    password,
  });

  return res;
};

export const ChangingPassword = async (password, newPassword) => {
  const res = await api.post("/change_password", {
    oldPassword: password,
    newPassword,
  });

  return res;
};

export const changingEmail = async (email, password) => {
  const res = await api.post("/change_email", {
    email,
    password,
  });

  return res;
};

export const sendingChangeEmailCode = async (code) => {
  const res = await api.post("/change_email_code", { code });
  return res;
};
