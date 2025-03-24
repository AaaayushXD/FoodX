import { Icons } from "@/utils";
import { StarRating } from "../star/starReview";
import React, { useMemo, useState } from "react";
import { AddProductReview } from "@/features";
import { RippleButton } from "@/commons";

export const AverageReview = React.memo(
  ({
    ratings,
    productId,
  }: {
    ratings: Model.FeedbackDetail[];
    productId?: string;
  }) => {
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

    const [openRating, setOpenRating] = useState<boolean>(false);

    return (
      <div className="  w-full flex flex-col bg-white items-start justify-start gap-6 ">
        <div className="flex items-center justify-between w-full">
          <h1 className=" sm:text-[24px] text-[18px] font-semibold ">
            Reviews and ratings
          </h1>
          <RippleButton
            onClick={() => setOpenRating(!openRating)}
            className="flex max-w-[140px] sm:max-w-[155px] w-full justify-center items-center border border-gray-300 p-2  rounded-full  gap-3"
          >
            <Icons.comment className="sm:size-5 size-4 " />
            <p className=" sm:text-[16px] text-[14px]  ">Write a review</p>
          </RippleButton>
        </div>

        {/* average ratings */}
        <div className="w-full md:flex-row flex-grow gap-3 flex-col justify-between sm:gap-5 flex items-start ">
          <div className="w-full max-w-md flex flex-col  md:bg-[#E2EEFF] rounded-lg  items-start justify-start">
            <div className="flex md:flex-col w-full py-5 rounded-lg items-center justify-center gap-2">
              <h1 className="font-bold text-[50px] ">
                {averageRating.toFixed(1)}
              </h1>
              <div className="flex flex-col items-start justify-start gap-0.5">
                <StarRating size="5" rating={averageRating} />
                <span className=" text-[14px] text-[var(--secondary-text)] ">
                  {" "}
                  Based on {ratings.length.toFixed(1)} ratings
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-full border-dotted md:border-none   border-t flex   flex-col items-start justify-between gap-8 pt-5 ">
            {allRating.map((rating, key) => {
              const ratingCount = ratings?.filter(
                (rate) => rate.rating === rating
              );
              const percentage = (ratingCount.length / ratings.length) * 100;
              return (
                <div
                  key={key}
                  className=" relative  w-full sm:h-3 h-2 bg-slate-300 rounded-full "
                >
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
                      {`${ratingCount.length}(${ratingCount[0].rating.toFixed(
                        1
                      )}) `}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {openRating && (
            <AddProductReview
              action="add"
              openReview={openRating}
              productId={productId}
              setOpenReview={() => setOpenRating(!openRating)}
            />
          )}
        </div>
      </div>
    );
  }
);
