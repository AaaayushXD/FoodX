import { useEffect, useState } from "react";
import { Empty, Loader } from "@/common";
import Bell from "@/assets/order.mp3";
import { useSocket, Icons } from "@/utils";
import { OrderCard } from "@/components";
import { useAppSelector, usePaginateOrders } from "@/hooks";
import { aggregateOrders, getUserByUid } from "@/helpers";
import { customToast } from "@/common/toast/toast";
import Skeleton from "react-loading-skeleton";

export const RecentOrders = () => {
  const [url, setUrl] = useState<string>();

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const { initialOrders, setInitialOrders, loading } = usePaginateOrders({
    pageSize: 5,
    sort: "desc",
    status: "pending",
    direction: "next",
  });

  const { user } = useAppSelector();
  const { socket, loading: loader } = useSocket(user?.success);

  useEffect(() => {
    if (!loader) {
      const handleNewOrder = async (order: Ui.Order) => {
        const user = await getUserByUid(order.uid as string);
        const aggregateOrder = aggregateOrders([order]);
        const promiseResolve = await Promise.all(aggregateOrder);
        setInitialOrders((prev) => [...promiseResolve, ...prev]);
        const audio = new Audio(Bell);
        audio.play();
        customToast({
          orderId: order.orderId,
          products: order.products,
          orderRequest: order.orderRequest,
          name: user?.fullName as string,
          note: order.note as string,
        });
      };

      // Listen for the 'new_order' event
      socket?.on("new_order", handleNewOrder);

      // Cleanup listener when component unmounts
      return () => {
        socket?.off("new_order", handleNewOrder);
      };
    }
  }, [socket, setInitialOrders, loader]);

  return (
    <div className="flex flex-col px-2 py-4 w-full h-full  lg:max-w-[600px]">
      <div className="flex items-center justify-between pb-7">
        <h2 className="text-2xl text-[var(--dark-text)] tracking-wide text-nowrap">
          Recent Orders
        </h2>
        <p className="flex items-center justify-center text-[12px] cursor-pointer hover:underline text-[var(--primary-color)] flex-nowrap">
          <span className="text-nowrap" onClick={() => setUrl("order-list")}>
            View More
          </span>
          <Icons.chevronRight size={15} />
        </p>
      </div>
      <div
        className={`duration-200 max-h-[550px] scrollbar-custom px-5 overflow-y-scroll
         `}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-2 scroll-smooth ">
          {!loading ? (
            initialOrders.length > 0 ? (
              initialOrders?.map((order, index) => (
                <OrderCard
                  uid={order?.uid as string}
                  image={order?.image as string}
                  orderId={order?.id as string}
                  price={order.products?.reduce(
                    (productAcc, product) =>
                      productAcc +
                      Number(product.price) * Number(product.quantity),
                    0
                  )}
                  orderRequest={order?.orderRequest}
                  products={order?.products}
                  status={order?.status as Common.OrderStatus}
                  key={index}
                />
              ))
            ) : (
              <Empty
                action={() => setIsClicked(!isClicked)}
                children="No recent orders available"
              />
            )
          ) : (
            <div className="w-full">
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
            </div>
          )}
        </div>
      </div>
      {url && <Loader url={`${url}/`} />}
    </div>
  );
};
