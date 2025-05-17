import { revenueData } from "../revenue";
import { getWeekTotal } from "../week/weekRevenue";

export const monthlyRevenue = (data: Model.Revenue[]) => {
 if (!data)
   throw new Error(
     "data not found in weekly revenue : file=> linchartdata.ts"
   );
 try {
   const revenue = revenueData(data);
   const monthlyData = getWeekTotal(revenue);
   return monthlyData;
 } catch (error) {
   throw new Error(
     "Unable to get weekly revenue : file=> linechartdata.ts" + error
   );
 }
};