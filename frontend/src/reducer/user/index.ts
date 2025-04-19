import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./login/loginUser";
import { editUser } from "./edit/editUser";
import { registerUser } from "./register/registerUser";
import { logoutUser } from "./logout/logoutUser";
import { verifyNewUser } from "./verify/verifyUser";

// Define the initial state
const initialState: Auth.authState = {
  error: null,
  loading: true,
  success: false,
  userInfo: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogout: logoutUser,
  },
  extraReducers: (buidler) => {
    loginUser(buidler);
    editUser(buidler);
    verifyNewUser(buidler);
  },
});

export const authReducer = authSlice.reducer;
export const { authLogout } = authSlice.actions;
