import { PayloadAction } from "@reduxjs/toolkit";

export function addProducts<
  T extends { products: Ui.Product[]; lastFetched?: any }
>(
  state: T,
  { payload }: PayloadAction<{ products: Ui.Product[]; lastFetched: any }>
) {
  state.products = [...payload.products];
  state.lastFetched = payload.lastFetched;
}
