import { PayloadAction } from "@reduxjs/toolkit";

export function addProduct<T extends { products: Partial<Ui.Product[]> }>(
  state: T,
  action: PayloadAction<Ui.Product>
) {
  const productId = state.products.findIndex(
    (product) => product.id === action.payload.id
  );
  if (productId > -1) {
    state.products[productId].quantity += action.payload.quantity;
  } else {
    state.products.push(action.payload);
  }
}
