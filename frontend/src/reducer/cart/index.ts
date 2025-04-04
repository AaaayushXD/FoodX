import { createSlice } from "@reduxjs/toolkit";
import { addProduct } from "./add/addProduct";
import { deleteProduct } from "./delete/deleteProduct";
import { deleteAll } from "./reset/resetCart";

const initialState: { products: Ui.Product[] } = {
  products: [],
};

const productSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: addProduct,
    removeCart: deleteProduct,
    resetCart: deleteAll,
  },
});

export const { addToCart, removeCart, resetCart } = productSlice.actions;
export const cartReducer = productSlice.reducer;
