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
    baseURL: "http://localhost:8080/api/v1",
  });
}

// const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;
