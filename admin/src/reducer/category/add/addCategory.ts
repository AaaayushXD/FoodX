import { PayloadAction } from "@reduxjs/toolkit";

export function addCategory<T extends { categories: Ui.Category[] }>(
  state: T,
  action: PayloadAction<any>
) {
  const previousCategory = state.categories?.filter(
    (category) => category !== action.payload
  );
  state.categories = [...previousCategory, action.payload];
}
