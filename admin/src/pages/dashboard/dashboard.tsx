import React from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../store.js";
import Revenue from "@/features/analytics/order/day/day_orderAnalytic.js";
import { RecentOrders, RecentTickets } from "@/components";
import { TopCustomers, WeekReveneuChart } from "@/features";

const Dasboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.root.user);
  return (
    user?.success && (
      <div className="flex flex-col  items-center justify-center w-full gap-16 px-3 py-5 pb-5 2xl:container">
        <Revenue />
        <div className="flex  flex-col h-full items-start justify-between w-full px-3 gap-7 lg:flex-row">
          <RecentOrders />
      {
        user?.userInfo?.role === "admin" && (
          <RecentTickets />
        )
      }
        </div>
        <div className="flex flex-col items-center justify-between  w-full px-5 gap-5 md:flex-row">
          <div className="flex  w-full border-[var(--dark-border)] border-[1px] rounded-lg">
            <WeekReveneuChart />
          </div>
          {user?.userInfo?.role === "admin" && (
            <div className="hidden min-w-[380px] lg:block">
              <TopCustomers />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Dasboard;
