import { createSlice } from "@reduxjs/toolkit";
import { addFavourite } from "./add/addFavourite";
import { deleteAll } from "./reset/resetFavourite";
import { deleteFavourite } from "./delete/deleteFavourite";

const favouriteState: {
  favourite: string[];
} = {
  favourite: [],
};

const favouriteSlice = createSlice({
  name: "favourite",
  initialState: favouriteState,
  reducers: {
    addToFavourite: addFavourite,
    removeFavourite: deleteFavourite,
    resetFavourite: deleteAll,
  },
});

export const favouriteReducer = favouriteSlice.reducer;
export const { addToFavourite, removeFavourite, resetFavourite } =
  favouriteSlice.actions;
