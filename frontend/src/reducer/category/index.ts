import { createSlice } from "@reduxjs/toolkit";
import { addCategories } from "./add/addCategories";

const initialState: { categories: Ui.Category[] } = {
  categories: [],
};

const categorySlice = createSlice({
  name: "favourite",
  initialState: initialState,
  reducers: {
    addCategory: addCategories,
  },
});

export const categoryReducer = categorySlice.reducer;
export const { addCategory } = categorySlice.actions;
