import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Store } from "./store";
import { authLogout } from "./reducer/user";

// Flag to track if the token is being refreshed
let isRefreshing = false;
// Queue to store requests waiting for the token to refresh
let hasLoggedOut = false;
let failedRequestsQueue: Array<(token: string) => void> = [];

export const makeRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ensure this is set correctly in the environment file
});

makeRequest.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

makeRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;
    if (
      error?.response?.data?.message ===
      "Error verifying your token. Please try again later. TokenExpiredError: jwt expired"
    ) {
      // Unauthorized - likely due to an expired access token
      const refreshToken = Cookies.get("refreshToken");

      if (!refreshToken) {
        // No refresh token, force logout
        if (!hasLoggedOut) {
          hasLoggedOut = true;
          Store.dispatch(authLogout());
          toast.error("Your session has expired. Please log in again.");
          return Promise.reject("Unauthorized: No refresh token available.");
        }
      }

      if (!isRefreshing) {
        isRefreshing = true;
        Cookies.remove("accessToken"); // Remove expired access token

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Store the new tokens in cookies
          Cookies.set("accessToken", newAccessToken, { secure: true });
          Cookies.set("refreshToken", newRefreshToken, { secure: true });

          // Retry all failed requests after refreshing token
          failedRequestsQueue.forEach((cb) => cb(newAccessToken));
          failedRequestsQueue = [];
          isRefreshing = false;

          // Retry the original request with the new access token
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return makeRequest(error.config);
        } catch (refreshError) {
          // Refresh token request failed, force logout
          Store.dispatch(authLogout());
          failedRequestsQueue = [];
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } else {
        // If a token refresh is already in progress, queue the request
        return new Promise((resolve) => {
          failedRequestsQueue.push((token: string) => {
            error.config.headers["Authorization"] = `Bearer ${token}`;
            resolve(makeRequest(error.config));
          });
        });
      }
    }

    if (status === 403) {
      // Forbidden - Invalid or expired refresh token
      Cookies.remove("refreshToken");
      toast.error("Refresh token is invalid or expired. Please log in again.");
      Store.dispatch(authLogout());
      return Promise.reject("Forbidden: Invalid refresh token.");
    }

    // Handle other types of errors
    return Promise.reject(error);
  }
);
