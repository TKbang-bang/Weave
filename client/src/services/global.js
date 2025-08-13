import axios from "axios";
import api from "./api.service";
import { getAccessToken } from "./token.service";

export const userIsLogged = async () => {
  const token = getAccessToken();
  if (token) {
    const res = await axios.get("/protected/session/logged", {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });

    return res;
  } else {
    const res = await axios.get("/protected/session/logged");
    return res;
  }
};
