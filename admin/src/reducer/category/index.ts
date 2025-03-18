import { createSlice } from "@reduxjs/toolkit";
import { addCategory } from "./add/addCategory";

const categoryState: { categories: Ui.Category[] } = {
  categories: [],
};
const categorySlice = createSlice({
  initialState: categoryState,
  name: "category",
  reducers: {
    categoryAdd: addCategory,
  },
});

export const categoryReducer = categorySlice.reducer;
export const { categoryAdd } = categorySlice.actions;
