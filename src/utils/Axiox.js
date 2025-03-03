import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://taskmanager.ordertik.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("Token in localStorage:", localStorage.getItem("token"));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response.data?.errors?.[0] ?? error.response.data?.message ?? 'Unexpected error');
  }
);

export default axiosInstance;
