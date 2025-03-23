import { AverageReview } from "./average/averageReview";
import { get_productFeedback } from "@/services";
import { ApiError, Skeleton } from "@/helpers";
import { QueryClient, useQuery } from "react-query";
import { CustomerReview } from "./customer/customerReview";
import { useEffect, useState } from "react";
import { useAppSelector, useRating } from "@/hooks";
import { Icons, toaster } from "@/utils";

export default function ProductReview({ productId }: { productId: string }) {
  const { data, error, isError, isLoading, refetch } = useRating(productId);

  const [limitReview, setLimitReview] = useState<Model.FeedbackDetail[]>([]);
  const [view, setView] = useState<boolean>(false);

  if (error instanceof ApiError) {
    return toaster({
      className: "bg-red-50",
      icon: "error",
      message: error?.message,
      title: "Error",
    });
  }

  useEffect(() => {
    if (!view) {
      setLimitReview(data?.slice(0, 5));
    }
  }, [data, view]);

  return (
    <div className="w-full flex  flex-col items-start justify-start gap-16">
      <div className="flex flex-col sm:items-start items-center w-full justify-start  gap-5 sm:gap-10">
        {isLoading ? (
          <Skeleton
            children={{
              className: " w-full h-[60px]",
            }}
            className="w-full flex flex-col items-start justify-start gap-4"
            count={5}
          />
        ) : (
          <AverageReview productId={productId} ratings={data} />
        )}
      </div>
      <div
        className=" w-full flex flex-col 
      items-center justify-start gap-5"
      >
        {isLoading ? (
          <Skeleton
            children={{
              className: "max-w-lg w-full h-[60px]",
            }}
            className="w-full flex flex-col items-start justify-start gap-4"
            count={5}
          />
        ) : (
          limitReview?.map((review) => (
            <CustomerReview key={review.id} review={review} />
          ))
        )}
        {!view && (
          <button
            onClick={() => setView(!view)}
            className=" text-sm tracking-wide px-1 py-0.5 hover:bg-gray-300 duration-150 ring-gray-200 max-w-[100px] rounded-xl ring-[1px] w-full flex gap-1 items-center justify-center  "
          >
            View all <Icons.chevronRight className="rotate-90 size-4 text-black  " />
          </button>
        )}
      </div>
    </div>
  );
}
