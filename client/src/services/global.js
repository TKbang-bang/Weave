import axios from "axios";

export const userIsLogged = async () => {
  const res = await axios.get("/user_is_logged");
  return res;
};
