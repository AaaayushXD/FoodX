import React, { useEffect, useState } from "react";
import { getOrderByUser } from "../services";
import { useHooks } from "./useHooks";
import { useAppSelector } from "./useActions";
import { ApiError, useAggregateUserOrder } from "@/helpers";

interface Condition {
  enable?: boolean;
}
export const useGetRecentOrder = (
  {
    pageSize,
    filter,
    sort,
    currentFirstDoc,
    currentLastDoc,
    direction,
    status,
    userId,
  }: Actions.GetOrderModal<keyof Model.Order>,
  { enable = true }: Condition
) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [data, setData] = React.useState<Model.UserOrder[]>([]);

  const recentOrder = async ({
    pageSize,
    currentFirstDoc,
    currentLastDoc,
    direction,
    filter,
    sort,
    status,
    userId,
  }: Actions.GetOrderModal<keyof Model.Order>) => {
    setLoading(true);
    try {
      const response = await getOrderByUser({
        filter: filter,
        pageSize: pageSize,
        sort: sort,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        direction: direction,
        status: status,
        userId: userId,
      });
      const userOrder = response.data.orders as Model.Order[];
      const aggregateOrder = useAggregateUserOrder(userOrder);
      if (!enable) return setData([]);
      setData(aggregateOrder);
    } catch (err) {
      setError(JSON.stringify(err));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (enable) {
      recentOrder({
        pageSize: pageSize,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
        direction: direction,
        filter: filter || ("orderRequest" as keyof Model.Order),
        sort: sort || "desc",
        status: status,
        userId: userId,
      });
    }
  }, [userId, filter, status]);

  return { data, loading, error };
};

export const useOrders = ({
  status,
  pageSize,
}: {
  status: Model.OrderStatus;
  pageSize?: number;
}) => {
  const { loading, setLoading, data, setData, setTotalData, totalData } =
    useHooks<Model.UserOrder[], "orderHistory">("orderHistory");

  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [error, setError] = useState<string>("");

  const { auth } = useAppSelector();
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getUserOrders = async ({ pageParam }) => {
    setLoading(true);
    setError("");
    const isPreviousOrderExist = data?.some((order) => order.status === status);
    if (!isPreviousOrderExist) {
      setHasMore(true);
      setCurrentDoc({ currentFirstDoc: "", currentLastDoc: "" });
      setData([]);
    }
    try {
      const response = await getOrderByUser({
        status: status,
        sort: "asc",
        pageSize: pageSize || 5,
        direction: "next",
        currentFirstDoc: pageParam?.currentFirstDoc || null,
        currentLastDoc: pageParam?.currentLastDoc || null,
        userId: auth?.userInfo?.uid,
      });

      setCurrentDoc({
        currentFirstDoc: response?.data.currentFirstDoc,
        currentLastDoc: response?.data.currentLastDoc,
      });

      setTotalData(response?.data.length);
      if (response?.data.length < 5) {
        setHasMore(false);
      }
      const orderHistory = useAggregateUserOrder(response?.data.orders);

      setData((prevOrders) => {
        if (!prevOrders || prevOrders.length === 0) {
          return orderHistory;
        }

        const updatedOrders = [
          ...prevOrders,
          ...orderHistory.filter(
            (data) => !prevOrders.some((orderData) => orderData.id === data.id)
          ),
        ];

        return updatedOrders;
      });
      return response?.data?.orders;
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error?.message);
        // toaster({
        //   title: error?.message,
        //   icon: "error",
        //   className: " bg-red-100 ",
        // });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders({
      pageParam: {
        currentFirstDoc: null,
        currentLastDoc: null,
      },
    });
  }, [status]);

  return {
    error,
    loading,
    currentDoc,
    hasMore,
    data,
    totalData,
    getUserOrders,
  };
};
