import React from "react";
import "react-circular-progressbar/dist/styles.css";
import { CardAnalytics } from "../Common/Analytics/CardAnalytics";
import data from "../../data.json";

const Revenue: React.FC = () => {
  const { dailyAnalyticsData } = data;
  console.log(dailyAnalyticsData)
  return (
    <React.Fragment>
      <div className="flex w-full items-center flex-wrap  justify-center md:justify-center sm:justify-start gap-3 sm:gap-10">
        {dailyAnalyticsData?.map((item, index) => {
          return <CardAnalytics item={item} key={index} />;
        })}
      </div>
    </React.Fragment>
  );
};

export default Revenue;