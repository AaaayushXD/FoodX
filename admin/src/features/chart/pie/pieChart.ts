

export const aggregateDailyCategoryOrder = async (
  orders: Model.Revenue[],
  allCategory: Ui.Category[]
) => {
  const categoryMap: { [key: string]: number } = {};

  orders.forEach((order) => {
    order?.orders?.forEach((product: Ui.Product) => {
      if (categoryMap[product.tagId]) {
        categoryMap[product.tagId] += Number(product.quantity);
      } else {
        categoryMap[product.tagId] = Number(product.quantity);
      }
    });
  });

  // Combine small categories
  const combinedCategories = combineSmallCategories(categoryMap as any, 5);

  const categories = combinedCategories?.map((reveneu) => {
    let label: string = reveneu.label; // Start with the existing label

    if (label === "Others") {
      label = "others";
    } else {
      const matchingCategory = allCategory?.find(
        (category) => category.id === reveneu.label
      );

      if (matchingCategory && matchingCategory !== undefined) {
        label = matchingCategory.name;
      }
    }

    return {
      ...reveneu,
      label: label,
    };
  });

  const filterCategories = categories?.filter(
    (data) => data.label !== "undefined"
  );
  const existCategories = filterCategories?.filter((category) =>
    allCategory?.some((data) => category.label === data.name)
  );
  return existCategories;
  return categories;
};

interface dataProp {
  [key: string]: number; // Assuming 'data' is an object where keys are strings and values are numbers
}

export const combineSmallCategories = (
  data: dataProp, // Change to object
  minCount: number = 5
) => {
  const result: { label: string; value: number }[] = [];
  let othersTotal = 0;

  // Iterate over the keys of the object
  Object.keys(data).forEach((key) => {
    const value = data[key]; // Access the value using the key

    if (value === undefined || value < minCount) {
      othersTotal += value || 0;
    } else {
      result.push({ label: key, value: value });
    }
  });

  // If there's any category with value < minCount, add "Others" label
  if (othersTotal > 0) {
    result.push({ label: "Others", value: othersTotal });
  }

  return result;
};
