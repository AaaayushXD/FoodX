import { createAsyncThunk } from "@reduxjs/toolkit";
import { addBanner } from "@/services";

export const postBannerAction = createAsyncThunk(
  "banner/new",
  async ({ data, cb }: { data: any; cb: () => void }, thunkApi) => {
    try {
      const response = await addBanner(data);
      cb();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue("Error while posting new banner");
    }
  }
);
