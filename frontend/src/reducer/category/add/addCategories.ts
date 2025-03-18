import { PayloadAction } from "@reduxjs/toolkit";

export const addCategories = (
  state: { categories: Ui.Category[] },
  { payload }: PayloadAction<Ui.Category[]>
) => {
  const existingIds = new Set(
    state?.categories?.map((category) => category?.id)
  );

  const newCategories = payload?.filter(
    (category) => !existingIds.has(category?.id)
  );

  if (newCategories) {
    state.categories = [...state.categories, ...newCategories];
  }
};
