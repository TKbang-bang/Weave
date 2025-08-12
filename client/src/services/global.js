import api from "./api.service";

export const userIsLogged = async () => {
  const res = await api.get("/is_user_logged");
  return res;
};
