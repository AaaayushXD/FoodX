export const SearchBanner = (categories: Ui.BannerModel[], value: string) => {
  const searchingCategory = categories?.filter((category) => {
    return category.title?.toLowerCase().includes(value);
  });
  return searchingCategory;
};
