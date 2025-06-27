import { signUpAction } from "@/actions";
import { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";

export function registerUser<T extends ActionReducerMapBuilder<Auth.authState>>(builder:T) {
  builder.addCase(signUpAction.pending, (state) => {
    state.loading = true;
    state.userInfo = {};
  });
  builder.addCase(
    signUpAction.fulfilled,
    (state, action: PayloadAction<Auth.User | undefined>) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.userInfo = action.payload || {};
    }
  );
  builder.addCase(
    signUpAction.rejected,
    (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    }
  );
}
