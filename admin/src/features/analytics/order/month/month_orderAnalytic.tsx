import React, { useEffect, useState } from "react";
import { CardAnalytics } from "@/components";
import { Filter, X } from "lucide-react";

import dayjs from "dayjs";
import { useAllRevenue } from "@/hooks";
import { aggregateMonthlyData } from "../productAnalytic";
import { Button } from "@/common";
import Skeleton from "react-loading-skeleton";

export const MonthlyAnalytics: React.FC = () => {
  const [totalOrder, setTotalOrder] = useState<Prop.CardAnalyticsProp[]>([]);

  const [filter, setFilter] = useState<{
    dateFilter?: { startDate: string; endDate: string; id?: string };

    normalFilter?: { previous: string; id?: string };
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

  const getDailyData = async () => {
    try {
      const filterValue = filter?.normalFilter
        ? 2
        : filter?.dateFilter?.startDate
        ? (dayjs().date() as number)
        : 1;
      const analyticsData = aggregateMonthlyData(
        currentRevenue as Model.Revenue[],
        filterValue
      );
      setTotalOrder(analyticsData as Prop.CardAnalyticsProp[]);
    } catch (error) {
      throw new Error("Error while fetching revenue " + error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      getDailyData();
    }
  }, [currentRevenue, isLoading]);

  return (
    <React.Fragment>
      <div className="flex items-end  justify-start flex-col gap-4 ">
        <div className="w-full flex items-center justify-between ">
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
                      dateFilter: { endDate: "", startDate: "", id: "" },
                    }))
                  }
                  className=" "
                >
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
            {filter?.normalFilter?.id && (
              <div className="flex px-1 py-0.5 gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                <div className="flex gap-1 items-center justify-center">
                  <span className="text-[15px] text-[var(--dark-secondary-text)]">
                    {filter.normalFilter?.previous
                      .toLocaleLowerCase()
                      .slice(0, 15)}
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
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
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
                id: "8933lfjsl840fhn",
              },
            ]}
            checkFn={{
              checkTypeFn: (isChecked: boolean, id: string) => {
                if (!isChecked) {
                  setFilter((prev) => ({
                    ...prev,
                    normalFilter: { previous: "", id: "" },
                  }));
                }
                if (isChecked) {
                  setFilter((prev) => ({
                    ...prev,
                    normalFilter: {
                      previous: dayjs().format("YYYY-MM-Dd"),
                      id: id,
                    },
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
                <Filter
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
        <div className="flex items-center flex-wrap justify-between w-full gap-7 ">
          {!isLoading ? (
            totalOrder?.map((order, index) => (
              <CardAnalytics
                title={order?.title}
                total={order?.total}
                percentage={order?.percentage}
                subtitle={order?.subtitle}
                key={index}
              />
            ))
          ) : (
            <div className="w-full">
              <Skeleton
                height={170}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                className="w-full flex gap-5"
                containerClassName="w-full flex gap-5"
                count={3}
              />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
