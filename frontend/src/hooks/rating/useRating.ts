import { useState, useMemo } from "react";
import { useAppSelector } from "../useActions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get_productFeedback } from "@/services";
import { ApiError } from "@/helpers";

export const useRating = (productId: string) => {
  const [currentDoc, setCurrenDoc] = useState<Common.CurrentDocType>();
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { auth } = useAppSelector();
  const queryClient = useQueryClient();

  const stableProductId = useMemo(() => productId, [productId]);

  const get_productReview = async (): Promise<Model.FeedbackDetail[]> => {
    try {
      const response = await get_productFeedback({
        currentFirstDoc: currentDoc?.currentFirstDoc || null,
        currentLastDoc: currentDoc?.currentLastDoc || null,
        direction: "next",
        uid: auth?.userInfo?.uid,
        productId: stableProductId,
      });
      return response.data.feedbacks;
    } catch (error) {
      throw new ApiError(400, "Error while getting reviews: " + error);
    }
  };

  const { data, isError, isLoading, refetch, error } = useQuery({
    queryKey: ["product:review", stableProductId],
    queryFn: get_productReview,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!stableProductId,
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
