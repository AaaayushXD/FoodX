import dayjs from "dayjs";

import { QueryClient } from "react-query";

export const aggregateCategories = async (
  queryClient: QueryClient,
  categories: Ui.Category[],
  normalProducts: Ui.Product[],
  specialProducts: Ui.Product[]
) => {
  try {
    const revenues = queryClient.getQueryData<Analytic.Revenue[]>([
      `custom-date`,
      dayjs().startOf("month").format("YYYY-MM-DD"),
      dayjs().format("YYYY-MM-DD"),
    ]);

    const tagId = categories.map((category) => category.id);

    // Filter revenues to match the categories
    const matchedCategoryProducts = revenues?.filter((revenue) =>
      revenue.orders.some((order) => tagId.includes(order.tagId))
    );

    //aggregate totalOrder & Revenue
    const allCategory = categories?.map((revenueCategory) => {
      let revenue: number = 0;
      let order: number = 0;
      let item: number = 0;
      matchedCategoryProducts?.forEach((category) => {
        if (
          category.orders.some((order) => order.tagId === revenueCategory.id)
        ) {
          revenue += category.orders.reduce(
            (acc, curr) => acc + Number(curr.price) * Number(curr.quantity),
            0
          );
          order += category.orders.reduce(
            (acc, order) => acc + Number(order.quantity),
            0
          );
        }
        [
          ...(normalProducts as Ui.Product[]),
          ...(specialProducts as Ui.Product[]),
        ]?.forEach((product) => {
          if (product.tagId === revenueCategory.id) {
            item += Number([{ ...product }].length);
          }
        });
      });
      return {
        ...revenueCategory,
        revenue: revenue,
        order: order,
        item: item,
      };
    });

    // const maxSold = Math.max(...allCategory.map((category) => category.order));
 
    const aggregateCategory = allCategory.map((data: Ui.Category) => ({
      id: data.id,
      name: data.name,
      image: data.image,
      item: data.item,
      order: data.order,
  
      // rank: Math.round((data.order / maxSold) * 5),
    }));

    return aggregateCategory as Ui.Category[];
  } catch (error) {
    return null;
  }
};
