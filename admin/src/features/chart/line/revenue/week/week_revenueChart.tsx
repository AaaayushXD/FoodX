import { Empty } from "@/common";
import { getRevenue } from "@/services";
import { LineChart } from "@mui/x-charts";
import dayjs from "dayjs";
import { RotatingLines } from "react-loader-spinner";
import { calculateTotalRevenue, revenueData } from "../revenue";
import { useQuery } from "react-query";
import { Icons } from "@/utils";

export const WeekReveneuChart: React.FC = () => {
  const getLineChartData = async (): Promise<
    { time: string; revenue: number }[]
  > => {
    try {
      const response = await getRevenue({
        startDate: dayjs().startOf("week").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      });
      const totalData = revenueData(response.data);
      return totalData;
    } catch (error) {
      throw new Error("Error while fetching today revenue " + error);
    }
  };

  const { data: initialData, isLoading } = useQuery(
    "revenue:week",
    getLineChartData,
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const calculatePercentageChange = async (): Promise<string> => {
    let percentage: string;
    try {
      const response = await getRevenue({
        startDate: dayjs().subtract(1, "week").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      });
      const previousMonthData = revenueData(response?.data);
      const totalCurrent = calculateTotalRevenue(
        initialData as { time: string; revenue: number }[]
      );
      const totalPrevious = calculateTotalRevenue(previousMonthData);
      if (totalPrevious === 0) {
        percentage = "N/A";
      } else {
        const totalPercentage =
          ((totalCurrent - totalPrevious) / totalPrevious) * 100;
        percentage = totalPercentage.toFixed(2);
      }
      return percentage;
    } catch (error) {
      throw new Error("Error while calculating ther percentage " + error);
    }
  };

  const { data: percentage, isLoading: loading } = useQuery(
    "percentage:week",
    calculatePercentageChange,
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: initialData && initialData?.length > 0 ? true : false,
    }
  );
  return initialData && initialData?.length > 0 ? (
    <div className="flex  flex-col items-center justify-center w-full gap-5 px-3 py-5 rounded">
      <div className="flex items-center justify-between w-full gap-3 px-2">
        <div className="text-left text-xl text-[var(--dark-text)] flex justify-center items-center gap-3">
          <p className="text-nowrap">Weekly Revenue</p>
          <p
            className={`text-[16px]  tracking-wider  ${
              percentage?.includes("-") || percentage?.includes("N/A")
                ? "text-red-600"
                : "text-[var(--green-text)]  "
            } flex justify-center items-center gap-0.5  rounded-lg`}
          >
            <span>
              {loading ? "loading.." : parseFloat(percentage as string) + "%"}
            </span>
            <span className="mb-[2px]">
              <Icons.arrowUp
                className={` ${
                  percentage === "N/A"
                    ? "invisible"
                    : percentage?.includes("-")
                    ? "rotate-180 "
                    : ""
                }`}
                strokeWidth={3}
                size={12}
              />
            </span>
          </p>
        </div>
      </div>
      <div className="h-[400px] lg:h-[300px] w-full">
        {isLoading ? (
          <div className="flex w-full h-full items-center justify-center gap-3">
            <RotatingLines strokeColor="var(--dark-text)" width="27" />
            <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
              {" "}
              loading...
            </span>
          </div>
        ) : initialData && initialData?.length > 0 ? (
          <LineChart
            sx={{
              "& .MuiLineElement-root": {
                strokeDasharray: "2 2",
                strokeWidth: 3,
              },
              "&.hover .MuiLineElement-root": {
                fill: "white",
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
                fill: "var(--dark-text)",
                strokeWidth: "0.5",
              },
              "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                fill: "var(--dark-text)",
                strokeWidth: "0.4",
              },
            }}
            grid={{ vertical: true, horizontal: true }}
            slotProps={{
              noDataOverlay: {
                message: "No Data to display.",
                sx: {
                  color: "var(--dark-text)", // Set the text color to white
                  fontSize: "15px",
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
                data: initialData?.map((order) =>
                  dayjs(order["time"]).format("dddd")
                ),
                scaleType: "point",
              },
            ]}
            series={[
              {
                id: "revenue",
                data: initialData?.map((order) => order["revenue"]),
                type: "line",
                color: "#45c241",
              },
            ]}
          ></LineChart>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  ) : (
    <div className="pb-6 w-full">
      <Empty
        loading={loading}
        children="We aren't found today's order to show reveneu"
      />
    </div>
  );
};
