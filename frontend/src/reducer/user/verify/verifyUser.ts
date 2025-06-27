import { verifyAction } from "@/actions";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export function verifyNewUser(
  builder: ActionReducerMapBuilder<Auth.authState>
) {
  builder.addCase(verifyAction.pending, (state) => {
    state.loading = true;
    state.success = false;
  });
  builder.addCase(verifyAction.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;
    state.userInfo = action.payload as Auth.User;
  });
  builder.addCase(verifyAction.rejected, (state) => {
    state.error = true;
    state.loading = false;
    state.success = false;
  });
}
