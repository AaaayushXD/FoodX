import { updateUserAction } from "@/actions";
import { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";

export function editUser<T extends ActionReducerMapBuilder<Auth.authState>>(builder: T) {
  builder.addCase(updateUserAction.pending, (state) => {
    state.loading = true;
  });
  builder.addCase(
    updateUserAction.fulfilled,
    (state, action: PayloadAction<Auth.User>) => {
      const payload = action.payload;
      const keys = Object.keys(payload) as Array<keyof Actions.UpdateProfile>;

      keys.forEach((key) => {
        if (payload[key] !== undefined) {
          // Handle phoneNumber separately if needed
          if (key === "phoneNumber" && typeof payload[key] === "number") {
            state.userInfo[key] = String(payload[key]); // Convert number to string
          } else {
            state.userInfo[key] = payload[key] as string | undefined;
          }
        }
      });
    }
  );
  builder.addCase(updateUserAction.rejected, (_, action) => {
    throw new Error("Error in redux while update user " + action.payload);
  });
}
