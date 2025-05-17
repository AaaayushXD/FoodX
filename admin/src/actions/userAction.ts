import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn, verifyNewUser, updateAccount } from "@/services";
import { toaster } from "@/utils";
import { ApiError } from "@/helpers";

export const signInAction = createAsyncThunk(
  "auth/signin",
  async (data: Store.Login, thunkApi) => {
    try {
      const response = await signIn(data.email, data.password, data.role);
      toaster({
        icon: "success",
        className: "bg-green-50 ",
        message: response.message,
        title: "You are logged in!",
      });
      data?.onSuccess?.(true);
      return response.data;
    } catch (error: any) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50 ",
          icon: "error",
          message: error.message,
          title: "Error",
        });
      }
      if (error.response && error.response.data.message) {
        return thunkApi.rejectWithValue(error.response.data.message);
      } else {
        return thunkApi.rejectWithValue(error);
      }
    }
  }
);
export const verifyAction = createAsyncThunk(
  "auth/signUp",
  async ({ otp, uid }: { otp: number; uid: string }, thunkApi) => {
    try {
      const response = await verifyNewUser(otp, uid);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to sign up new user -> ${error}`
      );
    }
  }
);
export const updateUserAction = createAsyncThunk(
  "auth/update-user",
  async (data: Store.UpdateProfileInfo, thunkApi) => {
    try {
      const response = await updateAccount({ ...data });
      toaster({
        icon: "success",
        message: response.message,
        className: "bg-green-50",
      });
      return response.data;

    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error while action to update user -> ${error}`
      );
    }
  }
);
