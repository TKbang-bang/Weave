let accessToken = null;

export const setAccessToken = (token) => (accessToken = token);
export const getAccessToken = () => accessToken;
export const removeAccessToken = () => (accessToken = null);
