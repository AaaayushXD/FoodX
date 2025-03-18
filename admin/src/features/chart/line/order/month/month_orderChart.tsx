import { useAllRevenue } from "@/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { calculateTotalOrders, totalMonthOrder } from "../order";
import { Icons } from "@/utils";
import { Button } from "@/common";
import { LineChart } from "@mui/x-charts";
import { RotatingLines } from "react-loader-spinner";



export const MonthlyOrderLinechart: React.FC = () => {
  const [initialData, setInitialData] = useState<
    { time: string; orders: number }[]
  >([]);
  const [filter, setIsFilter] = useState<{
    dateFilter?: { startDate: string; endDate: string };
    normalFilter?: { previous: string; id: string };
  }>();
  const [previousData, setPreviousData] = useState<
    {
      time: string;
      orders: number;
    }[]
  >([]);
  const [percentageChange, setPercentageChange] = useState<string>();

  const { data: currentRevenue, isLoading } = useAllRevenue(
    {
      startDate:
        filter?.dateFilter?.startDate ||
        dayjs().startOf("month").format("YYYY-MM-DD"),
      endDate: filter?.dateFilter?.endDate || dayjs().format("YYYY-MM-DD"),
    },
    {
      enable: true,
    }
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

  const syncData = () => {
    const times = new Set();
    const allKeys: string[] = [];
    [...initialData, ...previousData]?.forEach((data) => {
      times.add(data.time);
    });

    times?.forEach((time: any) => {
      allKeys.push(time);
    });
    return { allKeys };
  };
  const { allKeys } = syncData();

  useEffect(() => {
    if (!loading && filter?.normalFilter?.previous) {
      const aggregatePreviousRevenue = totalMonthOrder(
        previousRevenue as Model.Revenue[]
      );
      setPreviousData(aggregatePreviousRevenue);
    } else if (!isLoading) {
      setPreviousData([]);
      const aggregateCurrentMonth = totalMonthOrder(
        currentRevenue as Model.Revenue[]
      );
      setInitialData(aggregateCurrentMonth);
    }
  }, [
    currentRevenue,
    filter?.normalFilter?.previous,
    previousRevenue,
    isLoading,
    loading,
  ]);

  const calculatePercentageChange = async () => {
    try {
      const previousMonthData = totalMonthOrder(
        previousRevenue as Model.Revenue[]
      );
      const totalCurrent = calculateTotalOrders(initialData);
      const totalPrevious = calculateTotalOrders(previousMonthData);
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
    if (initialData?.length) {
      calculatePercentageChange();
    }
  }, [initialData.length]);

  return (
    <div className="flex flex-col p-2 items-center justify-center w-full rounded">
      <div className="flex items-center justify-between w-full gap-3 ">
        <div className="  text-left text-xl text-[var(--dark-text)] flex justify-center items-center gap-2">
          <p className="text-nowrap">Monthly Order</p>
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
          types={[{ label: "Previous", value: "previous", id: "8933840fhn" }]}
          checkFn={{
            checkTypeFn: (isChecked: boolean, value: string, id) => {
              if (!isChecked) {
                setIsFilter((prev) => ({
                  ...prev,
                  normalFilter: { id: "", previous: "" },
                }));
              }
              if (isChecked) {
                setIsFilter((prev) => ({
                  ...prev,
                  normalFilter: { id: id, previous: value },
                }));
              }
            },
            dateActionFn: (firstDate, secondDate) => {
              if (firstDate && secondDate) {
                setIsFilter((prev) => ({
                  ...prev,
                  dateFilter: {
                    startDate: dayjs(firstDate).format("YYYY-MM-DD"),
                    endDate: dayjs(secondDate).format("YYYY-MM-DD"),
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
      <div className="flex pt-1 h-[20px]  w-full   items-center justify-start gap-2">
        {filter?.dateFilter?.startDate && filter.dateFilter.endDate && (
          <div className="flex px-1 overflow-hidden py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] w-[180px] text-[var(--dark-secondary-text)]">
                {filter.dateFilter?.startDate +
                  " to " +
                  filter.dateFilter.endDate}
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({
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
                {filter.normalFilter?.previous.charAt(0).toUpperCase() +
                  filter.normalFilter.previous.slice(1)}
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({
                  ...prev,
                  normalFilter: { id: "", previous: "" },
                }))
              }
              className=" "
            >
              <Icons.close className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="h-[398px]  lg:h-[398px] w-full">
        {isLoading || loading ? (
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
                stroke: "var(--dark-text)", // Set the hover line color to white
                strokeWidth: 1, // Adjust the thickness as needed
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                stroke: "var(--dark-text)", // Blue color for the X-axis line
                strokeWidth: 0.8,
              },
              "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                stroke: "var(--dark-text)", // Blue color for the Y-axis line
                strokeWidth: 0.8,
              },
              "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                letterSpacing: "2px",
                fill: "var(--dark-text)", // Blue color for the X-axis labels
                strokeWidth: "0.5",
              },

              "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                fill: "var(--dark-text)", // Red color for the Y-axis labels
                strokeWidth: "0.4",
                letterSpacing: "2px",
              },
            }}
            slotProps={{
              noDataOverlay: {
                message: "No Data to display.",
                sx: {
                  fill: "var(--dark-text)",
                  fontSize: "16px",
                },
              },
              legend: {
                hidden: true,
                direction: "row",
                labelStyle: { fontSize: "14px" },
                position: { vertical: "bottom", horizontal: "middle" },
              },
            }}
            xAxis={[
              {
                labelStyle: { color: "white" },
                data: allKeys?.map((data) => data),
                scaleType: "point",
              },
            ]}
            series={[
              {
                id: "revenue",
                data: initialData?.map((order) => order["orders"] || null),
                type: "line",
                color: "#45c241",
                highlightScope: { fade: "global", highlight: "item" },
              },
              previousData && {
                data: previousData?.map((order) => order["orders"]),
                color: previousData?.length > 0 ? "red" : "transparent",
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
          ></LineChart>
        )}
      </div>
    </div>
  );
};
