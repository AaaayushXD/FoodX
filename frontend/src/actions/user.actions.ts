import { createAsyncThunk } from "@reduxjs/toolkit";
import * as userAction from "@/services";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";
import toast from "react-hot-toast";

export interface SigninTypes {
  email: string;
  password: string;
  userRole: "customer";
}

const signUpAction = createAsyncThunk(
  "auth/signUp",
  async (data: Auth.ValidationType, thunkApi) => {
    console.log(data);
    try {
      const response = await userAction.signUp({ ...data });
      if (response?.message) {
        toaster({
          title: response?.message,
        });
      }
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: error?.message,
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
  async (data: SigninTypes, { rejectWithValue }) => {
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
      return response.data;
    } catch (error) {
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
  "auth/signUp",
  async ({ otp, uid }: { otp: number; uid: string }, thunkApi) => {
    try {
      const response = await userAction.verifyNewUser(otp, uid);
      return response;
    } catch (error) {
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
    return thunkApi.rejectWithValue(
      `Error while action to update user -> ${error}`
    );
  }
});

export { signInAction, verifyAction, updateUserAction, signUpAction };
