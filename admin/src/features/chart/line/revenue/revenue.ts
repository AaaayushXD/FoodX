import { aggregateRevenue } from "@/helpers";
import dayjs from "dayjs";

export const revenueData = (data: Model.Revenue[]) => {
  if (!data) throw new Error("data not found");
  try {
    const aggregateDaysOrders = data?.map((order) => {
      return { ...order, id: dayjs(order.id).format("YYYY-MM-DD") };
    });

    const orders = aggregateDaysOrders.map(
      (order): { revenue: number; time: string } => {
        const revenue = aggregateRevenue(order.orders);
        return {
          revenue: revenue,
          time: order.id,
        };
      }
    );
    return orders;
  } catch (error) {
    throw new Error("Unable to aggregate daily revenue data" + error);
  }
};

export const calculateTotalRevenue = (
  data: { time: string; revenue: number }[]
) => {
  return data?.reduce((total, current) => total + current?.revenue, 0);
};
