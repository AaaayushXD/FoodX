import { MonthlyAnalytics, MonthlyOrderChart, MonthlyOrderLinechart, MonthlyRevenueChart, PieChartAnalytics } from "@/features";

const Overview: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="w-full">
        <MonthlyAnalytics />
      </div>
      <div className="flex xl:flex-row flex-col items-center justify-between w-full gap-5 px-5 py-5">
        <div className="w-full h-full xl:max-w-[550px] flex flex-col items-center justify-center border-[1px] border-[var(--dark-border)] rounded-md px-2 py-0 min-w-[400px] flex-grow">
          <MonthlyOrderChart />
        </div>

        <div className="w-full xl:max-w-[500px] h-[450px] min-w-[200px] border-[1px] border-[var(--dark-border)] p-2 rounded-md">
          <MonthlyOrderLinechart />
        </div>
      </div>
      <div className="flex items-center 2xl:flex-row flex-col  justify-start w-full gap-3 px-5 ">
        <div className="w-full 2xl:max-w-[600px] border-[1px] border-[var(--dark-border)] rounded-md">
          <MonthlyRevenueChart />
        </div>
        <div className="flex  relative justify-center w-full items-center flex-grow border-[1px] border-[var(--dark-border)] rounded 2xl:w-[400px] ">
          <PieChartAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Overview;
