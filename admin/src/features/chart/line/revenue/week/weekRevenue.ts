import dayjs from "dayjs";

// get revenue  weekly-wise
export const getWeekTotal = (
 aggregateMonthlyData: {
   revenue: number;
   time: string;
 }[]
) => {
 const weeklyOrders: { time: string; revenue: number }[] = [];

 let weekNumber = 1;
 let weeklyTotal = 0;

 for (let i = 0; i < aggregateMonthlyData.length; i++) {
   const currentOrder = aggregateMonthlyData[i];

   // Calculate which week the current order belongs to
   const dayOfMonth = dayjs(currentOrder.time).date();
   const currentWeek = Math.ceil(dayOfMonth / 7);

   if (currentWeek === weekNumber) {
     weeklyTotal += currentOrder.revenue;
   } else {
     // Push the next week data
     weeklyOrders.push({
       time: `Week ${weekNumber}`,
       revenue: weeklyTotal,
     });

     // Reset and start new week
     weekNumber = currentWeek;
     weeklyTotal = currentOrder.revenue;
   }
 }

 // Push the last week data
 if (weeklyTotal > 0) {
   weeklyOrders.push({
     time: `Week ${weekNumber}`,
     revenue: weeklyTotal,
   });
 }

 return weeklyOrders;
};