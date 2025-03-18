

export const productSort = (products: Ui.Product[], sortType: Common.SortType) => {
  console.log(products, sortType)
  const filterProducts = products?.sort((a, b) => {
    if (sortType === "price[asc]") {
      return a.price - b.price;
    } else if (sortType === "price[desc]") {
      return b.price - a.price;
    } else if (sortType === "rating") {
      return b.rating - a.rating;
    } else if (sortType === "time") {
      return b.cookingTime - a.cookingTime;
    }
    return 0;
  });
  return filterProducts;
};
 

// type RatingFilter = "2.0" | "4.0" | "5.0"
// type TimeFilter = "10" | "20" | "30" | "60"
// type PriceFilter = "100" | "200" | "500" | "1000"; 

// type FilterType = `price[${PriceFilter}]` | `rating[${RatingFilter}]` | `time[${TimeFilter}] `

// export const productFilter = (products: Ui.Product[], filterType: FilterType) => {
  
// }
