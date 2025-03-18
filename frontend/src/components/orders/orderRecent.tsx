import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RecentCard } from "../card/order/recent_orderCard";
import { useGetRecentOrder } from "../../hooks/useOrders";
import Empty from "../../assets/empty.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../hooks/useActions";
import { Icons } from "../../utils";
import { useViewPort } from "@/hooks";

export const RecentOrder = () => {
  const store = useAppSelector();

  const { isVisible } = useViewPort();

  const { data, loading } = useGetRecentOrder(
    {
      pageSize: 5,
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: "next",
      filter: "orderRequest",
      userId: store?.auth?.userInfo?.uid as string,
      status: "pending",
    },
    { enable: isVisible }
  );

  const recentCardReference = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  return (
    <div className="w-full relative group/recent h-full flex text-[var(--dark-text)]  flex-col gap-6 bg-[var--light-foreground] px-5 py-4   rounded items-start justify-center">
      <h1 className="sm:text-[25px] text-[21px] tracking-wider font-semibold ">
        Recent Orders
      </h1>
      <div
        ref={recentCardReference}
        className="flex items-center w-full h-full gap-5 pb-4 overflow-x-auto item-scrollbar "
      >
        {!loading ? (
          data.length > 0 ? (
            data?.map((order) => <RecentCard key={order.id} item={order} />)
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
              <img src={Empty} alt="No orders found" className="mb-4 size-40" />
              <h4 className="text-xl text-[var(--dark-secondary-text)] mb-2">
                No recent orders found
              </h4>
              <p className="text-sm text-[var(--dark-secondary-text)] mb-4">
                It looks like you haven't placed any recent orders.
              </p>
              <button
                onClick={() => navigate("/#categories")}
                className="mt-4 bg-[var(--primary-light)] text-white py-2 duration-150 px-4 rounded hover:bg-[var(--primary-dark)]"
              >
                Browse Categories
              </button>
            </div>
          )
        ) : (
          <div className="flex w-full gap-4 ">
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        )}
      </div>
      {data?.length > 0 && (
        <div className="absolute z-50 px-1 flex justify-between invisible w-full duration-200 -translate-x-5 opacity-0 group-hover/recent:visible group-hover/recent:opacity-100 top-[8rem] sm:top-36">
          <button
            onClick={() => {
              recentCardReference.current?.scrollBy({
                behavior: "smooth",
                left: -300,
              });
            }}
            className=" p-2 hover:bg-[#68656541] duration-150 text-[var(--dark-text)] rounded-full "
          >
            <Icons.chevronLeft className="sm:size-6 size-5 " />
          </button>
          <button
            onClick={() => {
              recentCardReference.current?.scrollBy({
                behavior: "smooth",
                left: 300,
              });
            }}
            className="  p-2 hover:bg-[#68656541] duration-150  text-[var(--dark-text)] rounded-full "
          >
            <Icons.chevronRight className="sm:size-6 size-5 " />
          </button>
        </div>
      )}
    </div>
  );
};
