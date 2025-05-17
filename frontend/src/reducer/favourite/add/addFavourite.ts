import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

export function addFavourite<T extends { favourite: string[] }>(
  state: T,
  action: PayloadAction<string>
) {
  const productId = state.favourite.find(
    (product) => product === action.payload
  );
  if (productId) {
    state.favourite = state.favourite.filter(
      (product) => product == action.payload
    );
  } else {
    state.favourite.push(action.payload);
  }
}
