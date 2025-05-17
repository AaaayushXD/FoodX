import { PayloadAction } from "@reduxjs/toolkit";

export function deleteOrder<T extends { order: Model.Order[] }>(
  state: T,
  action: PayloadAction<Model.Order["orderId"]>
) {
  state.order = state.order.filter((order) => order.orderId !== action.payload);
}
