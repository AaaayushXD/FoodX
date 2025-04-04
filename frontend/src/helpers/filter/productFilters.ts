export const productSort = (
  products: Ui.Product[],
  sortType: Common.SortType
) => {
  const filterProducts = products?.sort((a, b) => {
    if (sortType === "price[asc]") {
      return a.price - b.price;
    } else if (sortType === "price[desc]") {
      return b.price - a.price;
    } else if (sortType === "rating") {
      return a.rating && b.rating && b.rating - a.rating;
    } else if (sortType === "time") {
      const timeA = String(a.cookingTime).split(" ")[1];
      const timeB = String(b.cookingTime).split(" ")[1];
      return (
        a.cookingTime && b.cookingTime && parseInt(timeB) - parseInt(timeA)
      );
    }
    return 0;
  });
  return filterProducts;
};

type RatingFilter = "2.0" | "4.0" | "5.0";
type TimeFilter = "10" | "20" | "30" | "60";
type PriceFilter = "100" | "200" | "500" | "1000";

type FilterType =
  | `price[${PriceFilter}]`
  | `rating[${RatingFilter}]`
  | `time[${TimeFilter}]`;

export const productFilter = (
  products: Ui.Product[],
  filterType: FilterType
) => {
  if (filterType.includes("price")) {
    if (filterType === "price[1000]") {
      return products?.filter((product) => product.price <= 1000);
    }
    if (filterType === "price[500]") {
      return products?.filter((product) => product.price <= 500);
    }
    if (filterType === "price[200]") {
      return products?.filter((product) => product?.price <= 200);
    }
    if (filterType === "price[100]") {
      return products?.filter((product) => product?.price <= 100);
    }
  }
  // Rating
  if (filterType.includes("rating")) {
    if (filterType === "rating[5.0]") {
      return products?.filter(
        (product) => product?.rating && parseInt(product?.rating) <= 5
      );
    }
    if (filterType === "rating[4.0]") {
      return products?.filter(
        (product) => product?.rating && parseInt(product?.rating) <= 4
      );
    }

    if (filterType === "rating[2.0]") {
      return products?.filter(
        (product) => product?.rating && parseInt(product?.rating) <= 2
      );
    }
  }
  // Delivery Time
  if (filterType.includes("time")) {
    if (filterType === "time[60]") {
      return products?.filter(
        (product) => getLastNumber(product?.cookingTime as string) <= 50
      );
    }
    if (filterType === "time[30]") {
      return products?.filter(
        (product) => getLastNumber(product?.cookingTime as string) <= 30
      );
    }
    if (filterType === "time[20]") {
      return products?.filter(
        (product) => getLastNumber(product?.cookingTime as string) <= 20
      );
    }
    if (filterType === "time[10]") {
      return products?.filter(
        (product) => getLastNumber(product.cookingTime as string) <= 20
      );
    }
  }
};

const getLastNumber = (value: string): number => {
  const matches = value.match(/\d+/g);
  const lastValue = matches && parseInt(matches[matches.length - 1]);

  return lastValue as number;
};
