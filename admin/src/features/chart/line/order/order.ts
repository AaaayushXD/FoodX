import { getOrderWeeklyTotal } from "./month/monthOrder";

export const orderData = (data: Model.Revenue[]) => {
 if (!data) throw new Error("data not found");
 try {
   const orders = data.map((order): { orders: number; time: string } => {
     const orders = totalOrder(order.orders);
     return {
       orders: orders,
       time: order.id,
     };
   });
   return orders;
 } catch (error) {
   throw new Error("Unable to aggregate daily orders data" + error);
 }
};

// calculate total order
const totalOrder = (products: Ui.Product[]) => {
 const total = products.reduce(
   (acc, order) => acc + Number(order.quantity as number),
   0
 );
 return total;
};

export const totalMonthOrder = (data: Model.Revenue[]) => {
 if (!data)
   throw new Error(
     "data not found in weekly revenue : file=> linchartdata.ts"
   );
 try {
   const order = orderData(data);
   const monthlyData = getOrderWeeklyTotal(order);
   return monthlyData;
 } catch (error) {
   throw new Error(
     "Unable to get weekly revenue : file=> linechartdata.ts" + error
   );
 }
};



export const calculateTotalOrders = (
 data: { time: string; orders: number }[]
) => {
 return data.reduce((total, current) => total + current.orders, 0);
};