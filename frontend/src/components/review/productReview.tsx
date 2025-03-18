import { AverageReview } from "./average/averageReview";
import { get_productFeedback } from "@/services";
import { ApiError, Skeleton } from "@/helpers";
import { QueryClient, useQuery } from "react-query";
import { CustomerReview } from "./customer/customerReview";
import { useState } from "react";
import { useAppSelector } from "@/hooks";
import { toaster } from "@/utils";

interface Rating {
  id: string;
  productId: string;
  userId: string;
  name: string;
  rating: number;
  comment?: string;
  likes: number;
  image?: string;
  createdAt: string;
}

export default function ProductReview() {
  const [currentDoc, setCurrenDoc] = useState<Common.CurrentDocType>();
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { auth } = useAppSelector();
  const queryClient = new QueryClient();

  const get_productReview = async (): Promise<Model.FeedbackDetail[]> => {
    try {
      const response = await get_productFeedback({
        currentFirstDoc: currentDoc?.currentFirstDoc || null,
        currentLastDoc: currentDoc?.currentLastDoc || null,
        direction: "next",
        uid: auth?.userInfo?.uid,
        pageSize: 5,
      });

      if (response.data.feedbacks.length < 2) {
        setHasMore(false);
      }
      setCurrenDoc({
        currentFirstDoc: response?.data?.currentFirstDoc,
        currentLastDoc: response?.data?.currentLastDoc,
      });
      const previousReview = queryClient.getQueryData(
        "product:review"
      ) as Model.FeedbackDetail[];

      const reviews = previousReview
        ? response?.data?.feedbacks?.filter(
            (newReview) =>
              !previousReview?.some((review) => review.id === newReview.id)
          )
        : response?.data?.feedbacks;

      return previousReview ? [...previousReview, ...reviews] : reviews;
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(error.message);
      }
    }
  };

  const { data, isError, isLoading, refetch, error } = useQuery(
    ["product:review"],
    {
      queryFn: get_productReview,
      staleTime: 5 * 60 * 60,
      cacheTime: 5 * 60 * 60,
      refetchOnWindowFocus: false,
    }
  );

  if (error instanceof ApiError) {
    return toaster({
      className: "bg-red-50",
      icon: "error",
      message: error?.message,
      title: "Error",
    });
  }

  return (
    <div className="w-full flex  flex-col items-start justify-start gap-16 mt-8 mx-auto">
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
          <AverageReview ratings={data} />
        )}
      </div>
      <div
        className="sm:w-1/2 w-full flex flex-col 
      items-start justify-start gap-5"
      >
        {isLoading ? (
          <Skeleton
            children={{
              className: "max-w-klg w-full h-[60px]",
            }}
            className="w-full flex flex-col items-start justify-start gap-4"
            count={5}
          />
        ) : (
          data?.map((review) => (
            <CustomerReview key={review.id} review={review} />
          ))
        )}
        {/* <button
          onClick={() => refetch()}
          className=" text-sm tracking-wide hover:underline w-full flex items-center justify-end px-2 -mt-4 "
        >
          View more
        </button> */}
      </div>
    </div>
  );
}
