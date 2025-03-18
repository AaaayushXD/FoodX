import { createSlice } from "@reduxjs/toolkit";

import { loginUser } from "./login/loginUser";
import { editUser } from "./edit/editUser";
import { logoutUser } from "./logout/logoutUser";

const authState: Auth.authState = {
  success: false,
  error: false,
  loading: false,
  userInfo: {},
};

const authSlice = createSlice({
  initialState: authState,
  name: "auth",
  reducers: {
    authLogout: logoutUser,
  },
  extraReducers: (builder) => {
    // action to login user
    loginUser(builder);

    editUser(builder);
  },
});
export const authReducer = authSlice.reducer;
export const { authLogout } = authSlice.actions;
