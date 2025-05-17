/* eslint-disable no-empty */
import { useAllRevenue } from "@/hooks";
import { BarChart } from "@mui/x-charts";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { RotatingLines } from "react-loader-spinner";
import { monthlyBarData } from "../order_barChart";
import { Button } from "@/common";
import { Icons } from "@/utils";

export const MonthlyOrderChart: React.FC = () => {
  const [initialData, setInitialData] = useState<
    { [key: string]: number | string }[]
  >([]);
  const [dataKey, setDataKey] = useState<string[]>([]);
  const [filter, setFilter] = useState<{
    dateFilter?: { startDate: string; endDate: string };
    normalFilter?: { previous: string; id: string };
  }>();

  const { data: currentRevenue, isLoading } = useAllRevenue(
    {
      startDate:
        filter?.normalFilter && filter?.normalFilter?.previous.length > 0
          ? dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD")
          : (filter?.dateFilter?.startDate as string) ||
            dayjs().startOf("month").format("YYYY-MM-DD"),
      endDate:
        filter?.normalFilter && filter?.normalFilter?.previous.length > 0
          ? dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD")
          : filter?.dateFilter?.endDate || dayjs().format("YYYY-MM-DD"),
    },
    { enable: true }
  );

  useEffect(() => {
    if (!isLoading) {
      const aggregateRevenue = monthlyBarData(currentRevenue as Model.Revenue[]);
      setInitialData(aggregateRevenue);
      const listOfKeys = extractUniqueKeys(aggregateRevenue);
      setDataKey(listOfKeys as string[]);
    }
  }, [currentRevenue, isLoading]);

  // const [percentageChange, setPercentageChange] = useState<string>();
  const extractUniqueKeys = (data: { [key: string]: number | string }[]) => {
    const allKeys = new Set();
    data.forEach((item) => {
      const labelKeys = Object.keys(item).filter((index) => index !== "time");
      labelKeys.forEach((key) => allKeys.add(key));
    });
    return [...allKeys];
  };

  const colorPallette = ["#003f5c", "#7a5195", "#ef5675", "#ffa600"];
  return (
    <div className={`w-full p-2 h-[450px]`}>
      <div className="w-full py-2  text-xl text-[var(--dark-text)] tracking-wider gap-2 flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <span>Top Products</span>
        </div>
        <div>
          <Button
            selectedAction={[filter?.normalFilter?.id as string]}
            bodyStyle={{
              width: "400px",
              top: "3rem",
              left: "-18rem",
            }}
            parent={
              <div className="flex border-[1px] border-[var(--dark-border)]  px-4 py-1.5 rounded items-center justify-start gap-2">
                <Icons.filter
                  strokeWidth={2.5}
                  className="size-5 text-[var(--dark-secondary-text)]"
                />
                <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                  Filter
                </p>
              </div>
            }
            checkFn={{
              checkActionFn: (isChecked: boolean, value: string, id) => {
                if (!isChecked) {
                  setFilter((prev) => ({
                    ...prev,
                    normalFilter: { id: "", previous: "" },
                  }));
                }
                if (isChecked) {
                  setFilter((prev) => ({
                    ...prev,
                    normalFilter: { id: id, previous: value },
                  }));
                }
              },
              dateActionFn: (firstDate, secondDate) => {
                if (firstDate && secondDate) {
                  setFilter((prev) => ({
                    ...prev,
                    dateFilter: {
                      endDate: dayjs(secondDate).format("YYYY-MM-DD"),
                      startDate: dayjs(firstDate).format("YYYY-MM-DD"),
                    },
                  }));
                }
              },
            }}
            action={[
              { label: "Previous", value: "previous", id: "27909q3ur98fu" },
            ]}
          />
        </div>
      </div>
      <div className="flex h-[20px] pt-1 items-center justify-start gap-2">
        {filter?.dateFilter?.startDate && filter.dateFilter.endDate && (
          <div className="flex px-1 py-0.5 gap-1 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] w-[180px] text-[var(--dark-secondary-text)]">
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
          <div className="flex px-1 py-0.5 gap-1 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {filter.normalFilter?.previous.toLocaleLowerCase().slice(0, 15)}
              </span>
            </div>
            <button
              onClick={() =>
                setFilter((prev) => ({
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
      <div className="w-full h-[400px]">
        {isLoading ? (
          <div className="flex w-full h-full items-center justify-center gap-3">
            <RotatingLines strokeColor="var(--dark-text)" width="27" />
            <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
              {" "}
              loading...
            </span>
          </div>
        ) : (
          <BarChart
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
            grid={{ horizontal: true }}
            colors={colorPallette}
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
                // labelStyle: {
                //   fontSize: "12px",
                // },
              },
            }}
            dataset={initialData}
            borderRadius={6}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "time",
                data: initialData?.map((data) => data["time"]),
              },
            ]}
            series={dataKey?.map((key) => ({
              dataKey: typeof key === "string" ? key : undefined,
              label: typeof key === "string" ? key : undefined,
            }))}
          />
        )}
      </div>
    </div>
  );
};
