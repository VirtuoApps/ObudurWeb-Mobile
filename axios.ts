import axios, { AxiosInstance } from "axios";

// ----------------------------------------------------------------------

// config

// ----------------------------------------------------------------------

let axiosInstance: AxiosInstance;

if (process.env.NODE_ENV === "production") {
  axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NEO_NESTJS_API_URL,
  });
} else {
  axiosInstance = axios.create({
    baseURL: "http://localhost:7070/api/v1",
  });
}

export const mainWebsiteUrl =
  process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3033";

// Set the auth token if it exists in localStorage
if (typeof window !== "undefined") {
  const token = localStorage.getItem("accessToken");
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

// const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    }

    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;
