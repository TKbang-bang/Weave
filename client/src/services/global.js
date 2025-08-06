import axios from "axios";

export const userIsLogged = async () => {
  const res = await axios.get("/is_user_logged");
  return res;
};
