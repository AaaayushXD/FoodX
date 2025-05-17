import { PayloadAction } from "@reduxjs/toolkit";

export function addOrder<T extends { order: Model.Order[] }>(
  state: T,
  action: PayloadAction<Model.Order>
) {
  const isOrderExist = state?.order?.some(
    (order) => order.orderId === action.payload.orderId
  );
  if (!isOrderExist) {
    state.order.push(action.payload);
  }
}
