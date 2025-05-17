import dayjs from "dayjs";
import { getRevenue as getRevenues } from "@/services";



export const getOrderId = async () => {
  const orders = await getRevenues({
    startDate: dayjs().startOf("month").toISOString(),
    endDate: dayjs().toISOString(),
  });
  const totalOrders = orders as Ui.Order[];
  const orderId = totalOrders?.map((order) => order.orderId);
  return orderId;
};


export const getOrder = (orders: Ui.Product[]) => {
  const order = orders?.reduce(
    (OrderQuan, od) => OrderQuan + Number(od?.quantity),
    1
  );
  return order;
};

export const SearchOrder = (Order: Ui.OrderModal[], value: string) => {
  const searchingProduct = Order?.filter((order) => {
    return order.name && order?.name.toLowerCase().includes(value);
  });
  return searchingProduct;
};
