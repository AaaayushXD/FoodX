import { data } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks";
import { fetchNotifications } from "@/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiError } from "@/helpers";

interface UseNotificationProp {
  isOpen: boolean;
}

export const useNotification = ({ isOpen }: UseNotificationProp) => {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetchData, setFetchedData] = useState<Model.Notification[]>([]);
  const [totalData, setTotalData] = useState<number>();
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();

  const { auth } = useAppSelector();

  const getNotification = async ({ pageParam = null }) => {
    try {
      const response = await fetchNotifications({
        userId: auth?.userInfo?.uid,
        currentFirstDoc: pageParam?.currentFirstDoc || null,
        currentLastDoc: pageParam?.currentLastDoc || null,
        pageSize: 5,
        direction: "next",
        sort: "asc",
      });

      setTotalData(response?.data.length);
      setCurrentDoc({
        currentFirstDoc: response.data.currentFirstDoc,
        currentLastDoc: response.data.currentLastDoc,
      });
      if (response.data.notifications.length < 4) setHasMore(false);
      setFetchedData((prev) => {
        const newNotifications = response?.data?.notifications?.filter(
          (notification) =>
            !prev.some(
              (prevNotification) => prevNotification.id === notification.id
            )
        );
        return prev ? [...prev, ...newNotifications] : newNotifications;
      });

      setTotalData(response.data.length);
      return {
        notifications: response.data.notifications,
        lastPage: { currentDoc },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          error?.statusCode,
          error?.message,
          error?.error,
          false
        );
      }
    }
  };

  const { isLoading, data, error, fetchNextPage, isError, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["fetch-notification"],
      queryFn: getNotification,
      getNextPageParam: (lastPage) => lastPage?.lastPage.currentDoc || null,
      initialPageParam: 5,
    });

  return {
    fetchData,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    hasMore,
    totalData,
    currentDoc,
  };
};
