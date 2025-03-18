import { Icons } from "@/utils";
import { StarRating } from "../star/starReview";
import React, { useMemo } from "react";

export const AverageReview = React.memo(
  ({ ratings }: { ratings: Model.FeedbackDetail[] }) => {
    const averageRating = React.useMemo(() => {
      return (
        ratings?.reduce((acc, rating) => acc + rating.rating, 0) /
        ratings.length
      );
    }, [ratings]);

    const allRating = React.useMemo(() => {
      return [1, 2, 3, 4, 5]?.filter((revenue) =>
        ratings?.some((rate) => rate.rating === revenue)
      );
    }, [ratings]);

    const percentage = (allRating?.length / ratings.length) * 100;

    return (
      <div className="  w-full flex flex-col bg-white p-3 items-start justify-start gap-5 ">
        <div className="w-full flex flex-col  items-start justify-start">
          <h1 className=" sm:text-[24px] text-[18px] font-semibold ">
            Reviews and ratings
          </h1>
          <div className="flex items-center justify-start gap-2">
            <h1 className="font-bold text-[50px] ">
              {averageRating.toFixed(1)}
            </h1>
            <div className="flex flex-col items-start justify-start gap-0.5">
              <StarRating size="4" rating={averageRating} />
              <span className=" text-[14px] text-[var(--secondary-text)] ">
                {" "}
                Based on {ratings.length.toFixed(1)} ratings
              </span>
            </div>
          </div>
        </div>
        <div className="w-full border-dotted pt-8 border-t max-w-lg flex flex-col items-start justify-start gap-8">
          {allRating.map((rating) => {
            const ratingCount = ratings?.filter(
              (rate) => rate.rating === rating
            );
            const percentage = (ratingCount.length / ratings.length) * 100;
            return (
              <div className=" relative max-w-lg w-full sm:h-4 h-2 bg-slate-300 rounded-full ">
                <div
                  style={{
                    width: `${percentage}%`,
                    boxSizing: "border-box",
                  }}
                  className={` ${
                    percentage < 50
                      ? "bg-red-500"
                      : percentage >= 50 && percentage < 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  } h-full  rounded-full `}
                ></div>
                {allRating[0] && (
                  <span className=" text-[15px] right-5 -top-5 sm:-top-6  absolute sm:text-[18px] ">
                    {`${ratingCount.length}(${ratingCount[0].rating.toFixed(1)}) `}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
