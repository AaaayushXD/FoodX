import dayjs from "dayjs";

export const getOrderWeeklyTotal = (
 aggregateMonthlyData: {
   orders: number;
   time: string;
 }[]
) => {
 const weeklyOrders: { time: string; orders: number }[] = [];

 let weekNumber = 1;
 let weeklyTotal = 0;

 for (let i = 0; i < aggregateMonthlyData.length; i++) {
   const currentOrder = aggregateMonthlyData[i];

   // Calculate which week the current order belongs to
   const dayOfMonth = dayjs(currentOrder.time).date();
   const currentWeek = Math.ceil(dayOfMonth / 7);

   if (currentWeek === weekNumber) {
     weeklyTotal += currentOrder.orders;
   } else {
     // Push the previous week data
     weeklyOrders.push({
       time: `Week ${weekNumber}`,
       orders: weeklyTotal,
     });

     // Reset and start new week
     weekNumber = currentWeek;
     weeklyTotal = currentOrder.orders;
   }
 }

 // Push the last week data
 if (weeklyTotal > 0) {
   weeklyOrders.push({
     time: `Week ${weekNumber}`,
     orders: weeklyTotal,
   });
 }

 return weeklyOrders;
};