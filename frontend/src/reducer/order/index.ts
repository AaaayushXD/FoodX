import { createSlice } from "@reduxjs/toolkit";
import { addOrder as orderAdd } from "./add/addOrder";
import { deleteOrder } from "./delete/deleteOrder";
import { editOrder } from "./edit/editOrder";
import { resetOrder as orderReset } from "./reset/resetOrder";

const initialState: {
  order: Model.Order[];
} = {
  order: [],
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: orderAdd,
    removeOrder: deleteOrder,
    updateOrder: editOrder,
    resetOrder: orderReset,
  },
});

export const { addOrder, removeOrder, resetOrder, updateOrder } =
  OrderSlice.actions;
export const OrderReducer = OrderSlice.reducer;
