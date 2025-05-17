import { PayloadAction } from "@reduxjs/toolkit";

export function deleteFavourite<T extends { favourite: string[] }>(
  state: T,
  action: PayloadAction<string>
) {
  state.favourite = state.favourite.filter(
    (product) => product !== action.payload
  );
}
