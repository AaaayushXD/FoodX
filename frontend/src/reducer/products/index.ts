import { createSlice } from "@reduxjs/toolkit";
import { addProducts } from "./add/addProducts";

const initialState: Model.initialStateProp = {
  products: [],
  isError: false,
  isLoading: false,
  lastFetched: "",
  error: "",
};

const productSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    productAdd: addProducts,
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload.error;
      state.isError = payload.isError;
    },
    clearProducts: (state) => {
      state.products = [];
      state.error = "";
      (state.isError = false),
        (state.isLoading = false),
        (state.lastFetched = "");
    },
  },
});

export const productReducer = productSlice?.reducer;
export const { productAdd, setError, setLoading,clearProducts } = productSlice?.actions;
