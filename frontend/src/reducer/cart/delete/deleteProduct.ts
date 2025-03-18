import { PayloadAction } from "@reduxjs/toolkit";

export function deleteProduct<T extends { products: Ui.Product[] }>(
  state: T,
  action: PayloadAction<Ui.Product["id"]>
) {
  state.products = state.products.filter(
    (product) => product.id !== action.payload
  );
}
