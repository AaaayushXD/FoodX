import React, { useEffect, useState } from "react";
import { useOrders } from "@/hooks";
import { NotificationLoader, OrderCard } from "@/components";
import { Icons } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Empty, Error } from "@/common";
import EmptyImage from "@/assets/orderEmpty.webp";
import { useInView } from "react-intersection-observer";

export const OrderPage = () => {
  const [currentState, setCurrentState] =
    useState<Model.OrderStatus>("pending");

  const { currentDoc, hasMore, data, getUserOrders, error, loading } =
    useOrders({ status: currentState });
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    rootMargin: "0px 0px 100px 0px",
    threshold: [0.8],
  });

  useEffect(() => {
    if (!loading && inView && hasMore && !error) {
      getUserOrders({
        pageParam: {
          currentFirstDoc: currentDoc?.currentFirstDoc,
          currentLastDoc: currentDoc?.currentLastDoc,
        },
      });
    }
  }, [hasMore, inView, loading, error]);

  // async function handleInfiniteScroll() {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //       document.documentElement.scrollHeight - 1 &&
  //     hasMore
  //   ) {
  //     getUserOrders({
  //       pageParam: {
  //         currentFirstDoc: currentDoc?.currentFirstDoc,
  //         currentLastDoc: currentDoc?.currentLastDoc,
  //       },
  //     });
  //   }
  // }

  // const optimizedScrollHandler = useCallback(() => {
  //   requestAnimationFrame(handleInfiniteScroll);
  // }, []);

  // useEffect(() => {
  //   window.addEventListener("scroll", optimizedScrollHandler);

  //   return () => {
  //     window.removeEventListener("scroll", optimizedScrollHandler);
  //   };
  // }, [optimizedScrollHandler]);

  return (
    <div className="w-full flex flex-col items-start justify-start">
      <OrderStatusFilter
        currentState={currentState}
        setCurrentState={(value) => setCurrentState(value)}
      />

      <div className="w-full h-full pt-36 flex flex-col items-start justify-start gap-4">
        {error ? (
          <Error
            title="Error"
            message={error}
            button={{
              onClick: () =>
                getUserOrders({
                  pageParam: {
                    currentFirstDoc: null,
                    currentLastDoc: null,
                  },
                }),
              title: "Refresh",
            }}
          />
        ) : data && data?.length <= 0 && !loading ? (
          <Empty
          image={EmptyImage}
          title="No Orders Yet"
          description="Looks like you haven't placed any orders. Start exploring delicious meals now!"
          action={() => navigate("#categories")}
          actionTitle="Browse Categories"
        />
        
        ) : (
          data?.map((order) => <OrderCard key={order.id} {...order} />)
        )}
        <div className="w-full" ref={ref}>
          {loading && <NotificationLoader />}
        </div>
      </div>
    </div>
  );
};

interface OrderStatusProp {
  currentState: Model.OrderStatus;
  setCurrentState: (status: Model.OrderStatus) => void;
}
const OrderStatusFilter: React.FC<OrderStatusProp> = ({
  setCurrentState,
  currentState,
}) => {
  const orderStatus: Model.OrderStatus[] = [
    "pending",
    "cancelled",
    "completed",
    "prepared",
    "preparing",
  ];
  const navigate = useNavigate();

  return (
    <div className=" w-full bg-white flex-col py-2 px-2 items-start z-[100]  justify-start  fixed top-0 left-0 right-0">
      <div className="w-full flex items-center justify-between">
        <button onClick={() => navigate("/")}>
          <Icons.arrowLeft className="text-black" />
        </button>
        <h1 className=" text-[18px] sm:text-[16px] font-semibold "> Orders</h1>
        <div></div>
      </div>
      <div className="w-screen flex pt-5 pr-4 items-center overflow-auto justify-start gap-4">
        {orderStatus?.map((order, index) => (
          <button
            key={index}
            onClick={() => setCurrentState(order)}
            className={`text-[16px]  ${
              currentState === order
                ? "text-white bg-red-600 "
                : "bg-gray-200 text-gray-500"
            }  border px-2 py-1   mb-2 rounded-md
             font-[500] sm:text-[18px]  `}
          >
            {order.charAt(0).toUpperCase() + order.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
