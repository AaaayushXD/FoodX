

export const SearchCategory = (categories: Ui.Category[], value: string) => {
 const searchingCategory = categories?.filter((category) => {
   return category.name.toLowerCase().includes(value.toLowerCase());
 });
 return searchingCategory;
};
