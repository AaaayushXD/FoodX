import { PayloadAction } from "@reduxjs/toolkit";

export function editOrder<T extends { order: Model.Order[] }>(
  state: T,
  action: PayloadAction<Model.Order>
) {
  const findOrder = state?.order?.find(
    (order) => order.orderId === action.payload.orderId
  );
  if (findOrder) {
    findOrder.status = action.payload.status;
  }
}
