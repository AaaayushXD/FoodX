import React, { useState } from "react";
import Overview from "./reports/Overview";
import ProductAnalytics from "./insights";

const Analytics: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "Overview" | "Analytics" | "Logs"
  >("Overview");

  const onTabClick = (page: "Overview" | "Analytics" | "Logs") => {
    setCurrentPage(page);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 py-5">
      <div className="flex  relative items-center tracking-wider justify-start w-full gap-5 text-[14px] text-[var(--dark-text)] border-b-[4px] border-b-[var(--dark-border)] pb-2 px-10">
        {/* tabs */}
        <p
          className={`relative cursor-pointer ${
            currentPage === "Overview"
              ? "text-[var(--primary-color)] font-semibold"
              : ""
          }`}
          onClick={() => onTabClick("Overview")}
        >
          Overview
          <span></span>
        </p>
        <p
          className={`relative cursor-pointer ${
            currentPage === "Analytics"
              ? "text-[var(--primary-color)] font-semibold"
              : ""
          }`}
          onClick={() => onTabClick("Analytics")}
        >
          Analytics
          <span></span>
        </p>
        <p
          className={`relative cursor-pointer ${
            currentPage === "Logs"
              ? "text-[var(--primary-color)] font-semibold"
              : ""
          }`}
          onClick={() => onTabClick("Logs")}
        >
          Logs
          <span></span>
        </p>
        <div
          className={` duration-150 ${
            currentPage === "Overview"
              ? "translate-x-0"
              : currentPage === "Analytics"
              ? "translate-x-[85px]"
              : currentPage === "Logs"
              ? "translate-x-[168px]"
              : ""
          }  absolute h-[4px] left-[40px] top-[29px] w-[70px] bg-[var(--primary-color)]`}
        ></div>
      </div>
      <div className="flex items-start justify-center w-full gap-8">
        {/* content */}
        {currentPage === "Overview" && <Overview />}
        {currentPage === "Analytics" && <ProductAnalytics />}
        {/* {currentPage === "Logs" && <Logs />} */}
      </div>
      {/* <MonthlyAnalytics />
      <PieChartAnalytics />
      <MonthlyRevenueChart /> */}
    </div>
  );
};

export default Analytics;
