import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3301",
  withCredentials: true, // Required for cookies
});

// Separate instance for refresh requests
const refreshAPI = axios.create({
  baseURL: "http://localhost:3301",
  withCredentials: true, // Required for refresh token cookie
});

let isRefreshing = false;
let failedRequestsQueue = [];

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip interceptor for auth endpoints
    if (originalRequest.url.includes("/api/auth/")) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Make refresh request - cookie will be sent automatically
          const response = await refreshAPI.post("/api/auth/refresh");
          console.log("The response is", response);

          // Retry queued requests
          failedRequestsQueue.forEach((promise) => {
            promise.resolve(API(promise.config));
          });
          failedRequestsQueue = [];

          // Retry the original request
          return API(originalRequest);
        } catch (refreshError) {
          // Clear any client-side auth state
          if (typeof window !== "undefined") {
            window.location.href =
              "/login?redirect=" + encodeURIComponent(window.location.pathname);
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            config: originalRequest,
            resolve,
            reject,
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default API;
