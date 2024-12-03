// utils/fetchWithAuth.js
export const fetchWithAuth = async (url, options = {}) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  const response = await fetch(url, options);
  if (response.status === 401) {
    // Handle token refresh logic if required
    console.error("Unauthorized. Handle token refresh.");
  }
  return response;
};
