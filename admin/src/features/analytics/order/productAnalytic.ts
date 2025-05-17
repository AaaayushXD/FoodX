import dayjs from "dayjs";
import { CardAnalytic } from "../../../@types/product.model";
import { Revenue } from "../../../@types/revenue.model";

export const aggregateCurrentDayData = (orders: Revenue[]) => {
  const today = dayjs().format("YYYY-MM-DD");
  try {
    const currentDayOrder = orders?.find((order) => {
      const orderDate = dayjs(order.id).format("YYYY-MM-DD");
      return today === orderDate;
    });

    const total7DaysOrders = orders?.filter((order) => {
      const orderDate = dayjs(order.id).format("YYYY-MM-DD");
      const last7Days = dayjs().subtract(7, "days").format("YYYY-MM-DD");
      return orderDate >= last7Days && orderDate <= today;
    });

    // Calculate average orders and average revenue per day over the past 7 days
    const totalRevenueLast7Days = getRevenue(total7DaysOrders);

    const totalOrderProductsInAWeek = total7DaysOrders.reduce(
      (acc, order) => acc + order.orders?.length,
      0
    );
    const revenueToday = getRevenue([currentDayOrder] as Revenue[]);

    const dailyAnalyticsData: CardAnalytic[] = [
      {
        title: "Items Delivered",
        total: currentDayOrder?.orders.length || 0,
        percentage: 100,
      },
      {
        title: "Average Items",
        total: Math.round(totalOrderProductsInAWeek / 7),
        percentage: Math.round(
          (totalOrderProductsInAWeek / 7 / totalOrderProductsInAWeek) * 100
        ),
      },
      {
        title: "Revenue",
        total: revenueToday || 0,
        percentage: Math.round((revenueToday / totalRevenueLast7Days) * 100),
      },
    ];

    return dailyAnalyticsData;
  } catch (error) {
    return null;
  }
};

export const aggregateMonthlyData = (
  orders: Revenue[],
  month: number
): CardAnalytic[] => {
  try {
    // Calculate total orders by summing up all quantities in each order
    const totalOrders = orders.reduce(
      (orderSum, order) =>
        orderSum +
        order.orders.reduce(
          (prodSum, product) => prodSum + Number(product.quantity),
          0
        ),
      0
    );

    // Calculate average orders per day of the current month
    const daysInCurrentMonth = dayjs().endOf("month").date();
    const averageOrder = totalOrders / daysInCurrentMonth;

    // Calculate total revenue for the current month
    const totalRevenue = getRevenue(orders);

    // Filter previous month orders and calculate previous month revenue
    const previousMonthOrders = orders.filter(
      (order) =>
        dayjs(order.id).month() === dayjs().subtract(month, "month").month()
    );
    const previousMonthRevenue = getRevenue(previousMonthOrders);

    // Calculate the revenue percentage change
    const revenuePercentage = previousMonthRevenue
      ? Math.round(
          ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        )
      : "N/A"; // Avoid division by zero, set as "N/A" if previous month revenue is 0

    // Prepare daily analytics data
    const dailyAnalyticsData: CardAnalytic[] = [
      {
        title: "Items Delivered",
        total: orders.length || 0,
        percentage: 100,
      },
      {
        title: "Average Items",
        total: Math.round(averageOrder),
        percentage: totalOrders
          ? Math.round((averageOrder / totalOrders) * 100)
          : 0,
      },
      {
        title: "Revenue",
        total: totalRevenue || 0,
        percentage: revenuePercentage,
      },
    ];

    return dailyAnalyticsData;
  } catch (error) {
    console.error("Error while aggregating monthly analytics data:", error);
    return [
      { title: "Items Delivered", total: 0, percentage: 0 },
      { title: "Average Items", total: 0, percentage: 0 },
      { title: "Revenue", total: 0, percentage: "N/A" },
    ]; // Return default values in case of error
  }
};

const getRevenue = (revenue: Revenue[]) => {
  const total = revenue.reduce(
    (acc, rev) =>
      acc +
      rev.orders.reduce(
        (innerAcc, product) =>
          innerAcc + Number(product.quantity) * Number(product.price),
        0
      ),
    0
  );
  if (!total) return 0;
  return total;
};
