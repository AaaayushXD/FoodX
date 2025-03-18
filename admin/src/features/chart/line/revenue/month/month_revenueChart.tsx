import { useAllRevenue } from "@/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { monthlyRevenue } from "./monthlyRevenue";
import { calculateTotalRevenue } from "../revenue";
import { Icons } from "@/utils";
import { Button } from "@/common";
import { RotatingLines } from "react-loader-spinner";
import { LineChart } from "@mui/x-charts";

export const MonthlyRevenueChart: React.FC = () => {
 const [initialData, setInitialData] = useState<
   { time: string; revenue: number }[]
 >([]);
 const [previousData, setPreviousData] = useState<
   { time: string; revenue: number }[]
 >([]);
 const [percentageChange, setPercentageChange] = useState<string>();
 const [filter, setFilter] = useState<{
   dateFilter?: { startDate: string; endDate: string };
   normalFilter?: { previous: string; id?: string };
 }>();

 const { data: currentRevenue, isLoading } = useAllRevenue(
   {
     startDate:
       filter?.dateFilter?.startDate ||
       dayjs().startOf("month").format("YYYY-MM-DD"),
     endDate: filter?.dateFilter?.endDate || dayjs().format("YYYY-MM-DD"),
   },
   { enable: true }
 );

 const { data: previousRevenue, isLoading: loading } = useAllRevenue(
   {
     startDate: dayjs()
       .subtract(1, "month")
       .startOf("month")
       .format("YYYY-MM-DD"),
     endDate: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
   },
   { enable: true }
 );

 useEffect(() => {
   if (!loading && currentRevenue && currentRevenue?.length > 0) {
     const aggregateMonthlyRevenue = monthlyRevenue(
       currentRevenue as Model.Revenue[]
     );
     setInitialData(aggregateMonthlyRevenue);
   }
 }, [loading, currentRevenue]);

 useEffect(() => {
   if (
     !isLoading &&
     filter?.normalFilter &&
     filter?.normalFilter?.previous.length > 0
   ) {
     const aggregatePreviousRevenue = monthlyRevenue(
       previousRevenue as Model.Revenue[]
     );
     setPreviousData(aggregatePreviousRevenue);
   } else if (!filter?.normalFilter?.previous) {
     setPreviousData([]);
   }
 }, [isLoading, filter?.normalFilter?.previous]);

 const syncData = () => {
   const times = new Set();
   const allKeys: string[] = [];

   [...initialData, ...previousData]?.forEach((time) => {
     times.add(time.time);
   });

   times?.forEach((time: any) => {
     allKeys.push(time);
   });

   return { allKeys };
 };

 const calculatePercentageChange = async () => {
   try {
     const previousMonthData = monthlyRevenue(previousRevenue as Model.Revenue[]);
     const totalCurrent = calculateTotalRevenue(initialData);
     const totalPrevious = calculateTotalRevenue(previousMonthData);
     if (totalPrevious === 0) {
       setPercentageChange("N/A"); // Handle zero previous orders
     } else {
       const percentage =
         ((totalCurrent - totalPrevious) / totalPrevious) * 100;
       setPercentageChange(percentage.toFixed(2));
     }
   } catch (error) {
     setPercentageChange("N/A");
   }
 };

 useEffect(() => {
   if (
     initialData?.length > 0 &&
     previousRevenue &&
     previousRevenue?.length > 0
   ) {
     calculatePercentageChange();
   }
 }, [initialData?.length, previousRevenue?.length]);
 const { allKeys } = syncData();

 return (
   <div className="flex px-5 flex-col h-[430px] items-center justify-start w-full gap-1 p-3 rounded">
     <div className="flex  items-center   justify-between w-full gap-3 ">
       <div className="text-left text-xl  text-[var(--dark-text)] flex justify-center items-center gap-2">
         <p className="text-nowrap">Monthly Revenue</p>
         <p
           className={`text-[16px]  tracking-wider  ${
             percentageChange?.includes("-") ||
             percentageChange?.includes("N/A")
               ? "text-red-600"
               : "text-[var(--green-text)]  "
           } flex justify-center items-center gap-0.5  rounded-lg`}
         >
           <span>{percentageChange}%</span>
           <span className="mb-[2px]">
             <Icons.arrowUp
               className={` ${
                 percentageChange === "N/A"
                   ? "invisible"
                   : percentageChange?.includes("-")
                   ? "rotate-180 "
                   : ""
               }`}
               strokeWidth={3}
               size={12}
             />
           </span>
         </p>
       </div>
       <Button
         selectedTypes={[filter?.normalFilter?.id as string]}
         bodyStyle={{
           width: "400px",
           top: "3rem",
           left: "-18rem",
         }}
         types={[
           {
             label: "Previous week",
             value: "previous",
             id: "8933lffffffsdjsl840fhn",
           },
         ]}
         checkFn={{
           checkTypeFn: (isChecked: boolean, value: string, id: string) => {
             if (!isChecked) {
               setFilter((prev) => ({
                 ...prev,
                 normalFilter: { previous: "", id: "" },
               }));
             }
             if (isChecked) {
               setFilter((prev) => ({
                 ...prev,
                 normalFilter: { previous: value, id: id },
               }));
             }
           },
           dateActionFn: (from, to) => {
             if (from && to) {
               setFilter((prev) => ({
                 ...prev,
                 dateFilter: {
                   startDate: dayjs(from).format("YYYY-MM-DD"),
                   endDate: dayjs(to).format("YYYY-MM-DD"),
                 },
               }));
             }
           },
         }}
         parent={
           <div className="flex border-[1px] border-[var(--dark-border)]  px-4 py-2 rounded items-center justify-start gap-2">
             <Icons.filter
               strokeWidth={2.5}
               className="size-5 text-[var(--dark-secondary-text)]"
             />
             <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
               Filter
             </p>
           </div>
         }
       />
     </div>
     <div className="flex  pt-1 h-[10px]  w-full  items-center justify-start gap-2">
       {filter?.dateFilter?.startDate && filter.dateFilter.endDate && (
         <div className="flex px-1 overflow-hidden py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
           <div className="flex gap-1  w-full items-center justify-center">
             <span className="text-[15px] w-[180px]   text-[var(--dark-secondary-text)]">
               {filter.dateFilter?.startDate +
                 " to " +
                 filter.dateFilter.endDate}
             </span>
           </div>
           <button
             onClick={() =>
               setFilter((prev) => ({
                 ...prev,
                 dateFilter: { endDate: "", startDate: "" },
               }))
             }
             className=" "
           >
             <Icons.close className="text-[var(--danger-text)] " size={20} />
           </button>
         </div>
       )}
       {filter?.normalFilter?.previous && (
         <div className="flex px-1 py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
           <div className="flex gap-1 items-center justify-center">
             <span className="text-[15px] text-[var(--dark-secondary-text)]">
               {filter.normalFilter?.previous.toLocaleLowerCase().slice(0, 15)}
             </span>
           </div>
           <button
             onClick={() =>
               setFilter((prev) => ({
                 ...prev,
                 normalFilter: { previous: "", id: "" },
               }))
             }
             className=" "
           >
             <Icons.close className="text-[var(--danger-text)] " size={20} />
           </button>
         </div>
       )}
     </div>
     <div className="h-[400px] lg:h-[335px] w-full">
       {loading || isLoading ? (
         <div className="flex w-full h-full items-center justify-center gap-3">
           <RotatingLines strokeColor="var(--dark-text)" width="27" />
           <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
             {" "}
             loading...
           </span>
         </div>
       ) : (
         <LineChart
           sx={{
             "& .MuiLineElement-root": {
               strokeDasharray: "2 2",
               strokeWidth: 3,
             },
             "& .MuiAreaElement-series-Germany": {
               fill: "url('#myGradient')",
             },
             "& .MuiChartsHoverLine": {
               stroke: "#fff", // Hover line color
               strokeWidth: 1,
             },
             "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
               stroke: "var(--dark-text)",
               strokeWidth: 0.8,
             },
             "& .MuiChartsAxis-left .MuiChartsAxis-line": {
               stroke: "var(--dark-text)",
               strokeWidth: 0.8,
             },
             "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
               letterSpacing: "2px",
               fill: "#fff",
               strokeWidth: "0.5",
             },
             "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
               fill: "#fff",
               strokeWidth: "0.4",
             },
           }}
           grid={{ vertical: true, horizontal: true }}
           slotProps={{
             noDataOverlay: {
               message: "No Data to display.",
               sx: {
                 fill: "var(--dark-text)",
                 fontSize: "16px",
               },
             },
             legend: {
               direction: "row",
               labelStyle: { fontSize: "14px" },
               position: { vertical: "bottom", horizontal: "middle" },
             },
           }}
           xAxis={[
             {
               data: allKeys?.map((data) => data),
               scaleType: "point",
             },
           ]}
           series={[
             {
               data: initialData?.map((order) => order["revenue"]),
               type: "line",
               color: "#45c241",
             },
             previousData && {
               data: previousData?.map((order) => order["revenue"]),
               type: "line",
               color: previousData?.length > 0 ? "red" : "transparent",
             },
           ]}
         ></LineChart>
       )}
     </div>
   </div>
 );
};