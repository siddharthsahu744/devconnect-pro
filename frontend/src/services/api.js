import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8085/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle token expiration or unauthorized errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export const getCurrentUserId = async () => {
  let userId = localStorage.getItem("userId");
  if (userId) return parseInt(userId);
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const email = JSON.parse(atob(token.split('.')[1])).sub;
    const res = await API.get("/auth/users");
    const user = res.data.find(u => u.email === email);
    if (user) {
      localStorage.setItem("userId", user.id);
      return user.id;
    }
  } catch (e) { return null; }
  return null;
};

export default API;