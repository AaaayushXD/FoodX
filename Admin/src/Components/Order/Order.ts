import { getUserInfo } from "../../Utility/user.utils";
import { Order, RecentOrder, status } from "../../models/order.model";

export const getRecentOrders = async (orders: Order[]) => {
  try {
    const aggregateData = orders?.map(
      async (item): Promise<RecentOrder | null | undefined> => {
        const user = await getUserInfo(item.uid as string);
        if (!user) {
          console.error(
            `Order ${item.orderId} does not have a valid user (UID: ${item.uid}).`
          );
          return null;
        }
        if (user && item) {
          const productNames = item.products?.map(
            (product) =>
              (product.name as string) + " × " + product.quantity + ", "
          );
          const price = item.products?.reduce(
            (totalProduct, product) =>
              totalProduct + Number(product.price) * Number(product.quantity),
            0
          );

          return {
            uid : item.uid,
            orderId: item.orderId,
            image: user.avatar as string,
            products: productNames,
            price: price,
            status: item.status as keyof status["status"],
            orderRequest: item.orderRequest as string,
          };
        }
      }
    );

    const getaggregateDataPromises = await Promise.all(aggregateData);
    return getaggregateDataPromises as RecentOrder[];

    // return sortByTime;
  } catch (error) {
    throw new Error("Unable to display orders data" + error);
  }
};
