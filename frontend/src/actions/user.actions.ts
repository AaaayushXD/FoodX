import { createAsyncThunk } from "@reduxjs/toolkit";
import * as userAction from "@/services";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";
import Cookies from "js-cookie";

export interface SigninTypes {
  email: string;
  password: string;
  userRole: "customer";
}

const signUpAction = createAsyncThunk(
  "auth/signUp",
  async (
    { data, navigate }: { data: Auth.ValidationType; navigate: Function },
    thunkApi
  ) => {
    try {
      const response = await userAction.signUp({ ...data });
      if (response?.message) {
        toaster({
          title: response?.message,
        });
      }
      const user = response.data;
      Cookies.set("accessToken", user.accessToken);
      Cookies.set("refreshToken", user.refreshToken);

      console.log(user);
      localStorage?.setItem("verifyType", "otp");
      if (!data?.isVerified) {
        navigate("/email-verification");
        return response.data;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: "Error",
          icon: "error",
          className: "bg-red-100",
          message: error?.message,
        });
      }
      return thunkApi.rejectWithValue(
        `Error while action to sign up new user -> ${error}`
      );
    }
  }
);

const signInAction = createAsyncThunk(
  "auth/signIn",
  async (data: SigninTypes & { navigate: Function }, { rejectWithValue }) => {
    try {
      const response = await userAction.signIn(
        data.email,
        data.password,
        data.userRole
      );
      if (response?.message) {
        toaster({
          title: response?.message,
          className: "bg-green-100",
          icon: "success",
          message: "You are logged in successfully",
        });
      }
      if (response?.success) {
        data?.navigate("/");
      }
      return response.data;
    } catch (error: any) {
      if (error instanceof ApiError) {
        toaster({
          title: error?.message,
          className: "bg-red-100",
          icon: "error",
        });
      }
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);

const verifyAction = createAsyncThunk(
  "auth/verify",
  async (
    {
      otp,
      uid,
      type,
      accessToken,
    }: {
      otp: string;
      uid: string;
      type: "otp" | "reset";
      accessToken?: string;
    },
    thunkApi
  ) => {
    try {
      const response = await userAction.verifyNewUser({
        code: otp,
        type, 
        accessToken,
        uid,
      });
      localStorage.removeItem("time");

      return response.data.userInfo;
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50",
          icon: "error",
          message: error?.message,
          title: "Error",
        });
      }
      return thunkApi.rejectWithValue(
        `Error while action to sign up new user -> ${error}`
      );
    }
  }
);

const updateUserAction = createAsyncThunk<
  Auth.User,
  Actions.UpdateProfile,
  { rejectValue: string } // Define rejectValue type explicitly
>("auth/update-user", async (data: Actions.UpdateProfile, thunkApi) => {
  try {
    const response = await userAction.updateAccount({ ...data });
    if (response?.message) {
      toaster({
        title: response?.message,
        className: "bg-green-100",
        icon: "success",
      });
    }
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      toaster({
        className: "bg-red-50",
        icon: "error",
        message: error?.message,
        title: "Error",
      });
    }

    return thunkApi.rejectWithValue(
      `Error while action to update user -> ${error}`
    );
  }
});

export { signInAction, verifyAction, updateUserAction, signUpAction };
