import dayjs from "dayjs";

export const aggregateOrders = (
 orders: Ui.Order[],
 pagination?: {
   perPage: number;
   currentPage: number;
 },
 users?: Auth.User[]
) => {
 const totalOrder = orders?.map(async (order, index): Promise<Ui.OrderModal> => {
   const user = users?.find((user) => user.uid === order.uid);

   return {
     id: order.orderId,
     uid: order.uid,
     name: user?.fullName || "User",
     phoneNumber: user?.phoneNumber,
     image: user?.avatar as string,
     products: order?.products,
     orderRequest: dayjs(order?.orderRequest).format(" YYYY-MM-DD, h:mm A"),
     orderFullfilled: dayjs(order?.orderFullfilled).format(
       "YYYY-MM-DD, h:mm A"
     ),
     status: order?.status,
     rank:
       (pagination!.currentPage - 1) * pagination!.perPage + (index + 1) || 1,
   };
 });
 return totalOrder;
};

export const aggregateRevenue = (products: Ui.Product[]) => {
  const revenue = products?.reduce(
    (productQuan, product) =>
      productQuan + Number(product.price) * Number(product.quantity),
    0
  );
  return revenue;
};
