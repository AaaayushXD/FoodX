import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { Store } from "@/store";

import { ApiError } from "./helpers";
import { toaster } from "./utils";
import { authLogout } from "./reducer";

// Flag to track if the token is being refreshed
let isRefreshing = false;
// Queue to store requests waiting for the token to refresh
let failedRequestsQueue: Array<(token: string) => void> = [];
let hasLoggedOut = false;

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
    if (axios?.isAxiosError(error)) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      throw new ApiError(status as number, data?.message, data?.errors, false);
    }
  }
);

makeRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;
    console.log(status, error);
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

          toaster({
            icon: "error",
            className: "bg-red-50",
            message: error?.response?.data?.message,
          });
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

          Cookies.set("accessToken", newAccessToken, { secure: true });
          Cookies.set("refreshToken", newRefreshToken, { secure: true });

          failedRequestsQueue.forEach((cb) => cb(newAccessToken));
          failedRequestsQueue = [];
          isRefreshing = false;

          // Retry the original request with the new access token
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return makeRequest(error.config);
        } catch (refreshError: any) {
          if (refreshError.response.data.statusCode === 403)
            Cookies.remove("refreshToken");
          Store.dispatch(authLogout());

          failedRequestsQueue = [];
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } else {
        // If a token refresh is already in progress, queue the request
        return new Promise((resolve,) => {
          failedRequestsQueue.push((token: string) => {
            error.config.headers["Authorization"] = `Bearer ${token}`;
            resolve(makeRequest(error.config));
          });
        });
      }
    }

    if (
      error?.response?.data?.message ===
      "Unauthorized access, Tokens unaviable."
    ) {
      // Forbidden - Invalid or expired refresh token
      Cookies.remove("refreshToken");
      toaster({
        title: "Session expired",
        message: "Your session was expired, Please login again",
        className: "bg-red-50",
        icon: "error",
      });
      Store.dispatch(authLogout());
      return Promise.reject("Forbidden: Invalid refresh token.");
    }

    // Handle other types of errors
    return Promise.reject(error);
  }
);
