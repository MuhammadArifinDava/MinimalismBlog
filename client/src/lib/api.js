import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  if (window.location.hostname.includes("herokuapp.com")) {
    baseURL = "https://minimalism-a93d11758d8d.herokuapp.com";
  } else {
    baseURL = "http://localhost:5001";
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
