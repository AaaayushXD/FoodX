import dayjs from "dayjs";

export const useAggregateUserOrder = (userOrder: Model.Order[]) => {
  try {
    const aggregateData = userOrder?.map((order): Model.UserOrder => {
      order.products?.map(
        (product) => (product.name as string) + " × " + product.quantity + ", "
      );
      const totalAmount = order?.products?.reduce(
        (productQuantity, product) =>
          productQuantity + product.quantity * product.price,
        1
      );
      return {
        id: order.orderId as string,
        products: order.products,
        time: dayjs(order.orderRequest).format("MM-DD-YYYY h:mm A"),
        status: order.status,
        amount: totalAmount,
      };
    });
    return aggregateData;
  } catch (error) {
    return [];
  }
};