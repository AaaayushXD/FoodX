import { useState } from "react";
import { useAppSelector } from "../useActions";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { get_productFeedback } from "@/services";
import { ApiError } from "@/helpers";

export const useRating = (productId: string) => {
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
        // productId: productId,
      });
      if (response.data.feedbacks.length < 2) {
        setHasMore(false);
      }
      // setCurrenDoc({
      //   currentFirstDoc: response?.data?.currentFirstDoc,
      //   currentLastDoc: response?.data?.currentLastDoc,
      // });
      const previousReview = queryClient.getQueryData([
        "product:review",
      ]) as Model.FeedbackDetail[];

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

  const { data, isError, isLoading, refetch, error } = useQuery({
    queryKey: ["product:review"],
    queryFn: get_productReview,
    staleTime: 5 * 60 * 60,
    gcTime: 5 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  return {
    currentDoc,
    data,
    isError,
    isLoading,
    refetch,
    error,
  };
};
