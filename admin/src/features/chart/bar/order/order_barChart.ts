import dayjs from "dayjs";

import weekOfYear from "dayjs/plugin/isoWeek";

interface WeeklyOrders {
  week: number;
  orders: Ui.Product[];
}

dayjs.extend(weekOfYear);

export const barData = (data: WeeklyOrders[]) => {
  if (!data) throw new Error("No found data : file: barchart.ts => line:72");
  try {
    const allOrder = data.map(
      (order): { [key: string]: string; time: string } => {
        const products = productWithQuantity(order.orders);
        const aggregateProduct = combineSmallCategories(products, 5);
        return {
          ...aggregateProduct,
          time: `Week ${order.week}`,
        };
      }
    );
    return allOrder;
  } catch (error) {
    throw new Error(
      "Unable to aggregate bar data : file: barchart.ts => line:76" + error
    );
  }
};

export const productWithQuantity = (orders: Ui.Product[]) => {
  const datas: { [key: string]: number } = {};
  orders?.forEach((data) => {
    datas[data.name]
      ? (datas[data.name] += Number(data.quantity))
      : (datas[data.name] = Number(data.quantity));
  });

  return datas;
};

export const monthlyBarData = (orders: Model.Revenue[]) => {
  if (!orders) throw new Error("No data found : line=> 101");
  const weeklyOrders = groupProductsByWeek(orders);
  const response = barData(weeklyOrders);
  return response;
};

// Helper function to calculate the week of the month
function getWeekOfMonth(date: dayjs.Dayjs): number {
  const startOfMonth = date.startOf("month"); // Start of the month
  const dayOfMonth = date.date(); // Day of the month (1 - 31)

  // Calculate the week of the month
  const weekOfMonth = Math.ceil((dayOfMonth + startOfMonth.day()) / 7);
  return weekOfMonth;
}

// Function to group products by week
function groupProductsByWeek(revenueArray: Model.Revenue[]): WeeklyOrders[] {
  const weeklyOrdersMap: { [key: number]: Ui.Product[] } = {}; // Object to store products by week number

  revenueArray.forEach((revenue) => {
    const revenueDate = dayjs(revenue.id);
    const weekNumber = getWeekOfMonth(revenueDate); // Get the week number

    if (!weeklyOrdersMap[weekNumber]) {
      weeklyOrdersMap[weekNumber] = []; // Initialize array if week not encountered before
    }

    // Add all products for this revenue entry to the respective week
    weeklyOrdersMap[weekNumber].push(...revenue.orders);
  });

  // Convert the object into an array of WeeklyOrders
  return Object.keys(weeklyOrdersMap).map((week) => ({
    week: parseInt(week, 10),
    orders: weeklyOrdersMap[Number(week)],
  }));
}

export const combineSmallCategories = (
  data: { [key: string]: number },
  minCount: number
) => {
  const entries = Object.entries(data);

  if (entries.length <= minCount) return data;

  // Sort categories by quantity in descending order
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

  // Keep the top categories and combine the rest as "Others"
  const topCategories = sortedEntries.slice(0, minCount);
  const others = sortedEntries.slice(minCount);

  // Calculate the total for "Others"
  const othersTotal = others.reduce((acc, [, quantity]) => acc + quantity, 0);

  // Return a new object with the top categories and "Others"
  const result = Object.fromEntries(topCategories);
  result["Others"] = othersTotal;

  return result;
};
