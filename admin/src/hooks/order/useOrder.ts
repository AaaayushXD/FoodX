import { aggregateOrders, ApiError, getUserByUid } from "@/helpers";
import { getOrders } from "@/services";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

export const usePaginateOrders = ({
  pageSize,
  direction,
  filter,
  sort,
  status,
  uid,
}: Api.FetchPaginate<keyof Ui.Order, Common.OrderStatus, "">) => {
  const queryClient = useQueryClient();

  const [initialOrders, setInitialOrders] = useState<Ui.OrderModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    pageDirecton?: "prev" | "next";
  }>({ currentPage: 1, perPage: 20 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [isFilter, setIsFilter] = useState<{
    // dateFilter?: any;
    sortFilter?: { id?: string; sort?: string };
  }>();
  const [haveUser, setHaveUser] = useState<Auth.User>();

  const fetchOrders = async ({
    pageSize,
    currentFirstDoc,
    currentLastDoc,
    direction,
    filter,
    sort,
    status,
    uid,
  }: Api.FetchPaginate<keyof Ui.Order, Common.OrderStatus, ""> & {
    queryClient: typeof queryClient;
  }) => {
    setLoading(true);
    try {
      const response = await getOrders({
        pageSize: pageSize || pagination.perPage,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        direction: direction,
        filter: filter,
        sort: sort,
        status: status,
        uid: uid,
      });
      setTotalData(response.data.length);
      setCurrentDoc({
        currentFirstDoc: response.data.currentFirstDoc,
        currentLastDoc: response.data.currentLastDoc,
      });

      const userPromises = response.data.orders.map(
        async (order): Promise<Auth.User> => {
          const cachedUser = queryClient.getQueryData(["user", order.uid]);
          if (cachedUser) {
            return cachedUser;
          } else {
            return await queryClient.fetchQuery(["user", order.uid], () =>
              getUserByUid(order.uid as string)
            );
          }
        }
      );

      const allUser = await Promise.all(userPromises);
      const aggregateOrder = aggregateOrders(
        response.data.orders,
        pagination,
        allUser
      );

      const aggregatePromiseOrder = await Promise.all(aggregateOrder);
      setInitialOrders(aggregatePromiseOrder);
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders({
      pageSize: pageSize || pagination.perPage,
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: pagination.pageDirecton || direction,
      filter:
        (isFilter?.sortFilter?.sort as keyof Ui.Order) ||
        filter ||
        "orderRequest",
      sort: sortOrder || sort || "desc",
      status: status,
      uid: haveUser?.uid,
      queryClient,
    });
  }, [isFilter?.sortFilter?.sort, sortOrder, haveUser]);

  useEffect(() => {
    if (pagination.pageDirecton && pagination.currentPage > 1) {
      const fetchNextPage = async () => {
        setLoading(true);
        try {
          const response = await getOrders({
            pageSize: pagination.perPage,
            currentFirstDoc: currentDoc?.currentFirstDoc,
            currentLastDoc: currentDoc?.currentLastDoc,
            direction: pagination.pageDirecton,
            filter:
              (isFilter?.sortFilter?.sort as keyof Ui.Order) || "orderRequest",
            sort: sortOrder || sort,
            status: status,
            uid: uid,
          });
          setTotalData(response.data.length);
          setCurrentDoc({
            currentFirstDoc: response.data.currentFirstDoc,
            currentLastDoc: response.data.currentLastDoc,
          });

          const userPromises = response.data.orders.map(
            async (order): Promise<Auth.User> => {
              const cachedUser = queryClient.getQueryData(["user", order.uid]);
              if (cachedUser) {
                return cachedUser;
              } else {
                return await queryClient.fetchQuery(["user", order.uid], () =>
                  getUserByUid(order.uid as string)
                );
              }
            }
          );

          const allUser = await Promise.all(userPromises);
          const aggregateOrder = aggregateOrders(
            response.data.orders,
            pagination,
            allUser
          );

          const aggregatePromiseOrder = await Promise.all(aggregateOrder);
          setInitialOrders((prev) => [
            ...prev,
            ...aggregatePromiseOrder.filter(
              (order: Ui.OrderModal) =>
                !prev.some((data) => data.id === order.id)
            ),
          ]);
        } catch (error) {
          throw new Error("Error while fetching orders " + error);
        } finally {
          setLoading(false);
        }
      };
      fetchNextPage();
    }
  }, [
    pagination.pageDirecton,
    pagination.currentPage,
    sortOrder,
    isFilter?.sortFilter?.sort,
  ]);

  return {
    loading,
    totalData,
    sortOrder,
    setSortOrder,
    pagination,
    setPagination,
    setIsFilter,
    isFilter,
    initialOrders,
    setInitialOrders,
    setHaveUser,
    haveUser,
  };
};
