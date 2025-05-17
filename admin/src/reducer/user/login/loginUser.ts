import { signInAction } from "@/actions/userAction";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export function loginUser(builder: ActionReducerMapBuilder<Auth.authState>) {
  builder.addCase(signInAction.pending, (state) => {
    state.loading = true;
    state.success = false;
  });
  builder.addCase(signInAction.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;
    state.userInfo = action.payload;
  });
  builder.addCase(signInAction.rejected, (state) => {
    state.error = true;
    state.loading = false;
    state.userInfo = {};
  });
}
