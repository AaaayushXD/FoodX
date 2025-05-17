import { updateUserAction } from "@/actions/userAction";
import { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";

export function editUser(builder: ActionReducerMapBuilder<Auth.authState>) {
  // Update existing user
  builder.addCase(updateUserAction.pending, (state) => {
    state.loading = true;
  });
  builder.addCase(
    updateUserAction.fulfilled,
    (state, action: PayloadAction<Store.UpdateProfileInfo>) => {
      const payload = action.payload;
      const keys = Object.keys(payload) as Array<keyof Store.UpdateProfileInfo>;

      keys.forEach((key) => {
        if (payload[key] !== undefined) {
          // Handle phoneNumber separately if needed
          if (key === "phoneNumber" && typeof payload[key] === "number") {
            state.userInfo[key] = payload[key]; // Convert number to string
          } else if (
            key !== "phoneNumber" &&
            typeof payload[key] !== "undefined"
          ) {
            state.userInfo[key] = payload[key] as string;
          }
        }
      });
    }
  );
}
