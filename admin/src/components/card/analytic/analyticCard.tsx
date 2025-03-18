import { Icons } from "@/utils";
import React from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

// export const CardAnalytics: React.FC<CardAnalyticsProp> = ({ item }) => {
//   console.log(item)
//   return (
//     <div className=" flex px-8 shadow-sm  h-[160px] w-full sm:w-[300px] items-center justify-between gap-10 bg-[var(--light-background)]   rounded  ">
//       <div className={`flex flex-col items-start justify-center gap-2 ${item ? "visible": "invisible"} `}>
//         <p className="text-[18px] font-[500] brightness-100 contrast-100  text-[var(--primary-color)] ">{item?.title} </p>
//         <p className="text-[25px] text-[var(--dark-foreground)]  font-bold ">
//           {item?.total}{" "}
//         </p>
//         <p className="text-[11px] text-[var(--dark-secondary-text)] ">
//           {item?.revenueInOneDay}
//         </p>
//       </div>
//       <div className="w-[100px]">
//       <CircularProgressbar
//         className="w-full h-full"
//         strokeWidth={15}
//         circleRatio={0.9}
//         minValue={0}
//         value={item?.percentage}
//         text={`${item?.percentage}%`}
//         styles={ buildStyles({
//           rotation: 0.25,
//           textSize: "17px",
//           pathTransitionDuration: 1,
//           textColor: "var(--dark-text)",
//           trailColor: "var(--light-background)",
//           backgroundColor: "red",
//           pathColor: `var(--primary-dark)`,

//         })}
//       />
//   </div>
//     </div>
//   );
// };

export const CardAnalytics: React.FC<Prop.CardAnalyticsProp> = ({
  title,
  percentage,
  subtitle,
  filter,
  total,
}: Prop.CardAnalyticsProp) => {
  return (
    <div className="flex flex-col items-center justify-center px-3 py-4 border border-[var(--dark-border)] rounded-lg md:w-[350px] w-full ">
      <div className="flex items-center justify-between w-full gap-3 px-2 pb-2">
        <div className="flex items-center justify-start gap-3">
          {" "}
          <p className="text-sm text-[var(--dark-secondary-text)] text-nowrap">
            {title}
          </p>
          {percentage && (
            <div className="flex text-xs text-[var(--green-text)] gap-1 px-1 py-0.5 rounded-md bg-[var(--light-secondary-background)]">
              <Icons.arrowUp size={15} />
              <p>{percentage}%</p>
            </div>
          )}
        </div>
        {filter && filter}
      </div>
      <h3 className="flex items-center justify-start w-full pl-2 text-[var(--dark-text)] text-[42px] font-semibold pb-1 pr-3">
        {total}+
      </h3>
      <p className="flex items-center justify-start w-full text-xs text-[var(--dark-secondary-text)] px-2 pb-1 text-nowrap">
        {subtitle}
      </p>
    </div>
  );
};
