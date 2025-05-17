import { signInAction } from "@/actions";
import { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";

export function loginUser<T extends ActionReducerMapBuilder<Auth.authState>>(
  builder: T
) {
  builder.addCase(signInAction.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.userInfo = {};
  });
  builder.addCase(
    signInAction.fulfilled,
    (state, action: PayloadAction<Auth.User>) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.userInfo = action.payload;
    }
  );
  builder.addCase(
    signInAction.rejected,
    (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    }
  );
}
