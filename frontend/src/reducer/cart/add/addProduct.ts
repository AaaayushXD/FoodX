import { PayloadAction } from "@reduxjs/toolkit";

export function addProduct(
  state: { products: Ui.Product[] },
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
