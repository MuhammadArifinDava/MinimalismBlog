import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    baseURL = "http://localhost:5001";
  } else {
    baseURL = "https://minimalism-a93d11758d8d.herokuapp.com";
  }
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
