import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "./token.service";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/protected`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["access-token"]?.split(" ")[1];
    if (newToken) setAccessToken(newToken);

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const retry = await api(originalRequest);
        return retry;
      } catch (e) {
        if (
          window.location.pathname !== "/sign" ||
          window.location.pathname !== "/verify" ||
          window.location.pathname !== "/forgotpassword"
        ) {
          window.location.href = "/sign";
        }
        removeAccessToken();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
