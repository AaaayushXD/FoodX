import { RecentCard } from "../card/order/recent_orderCard";
import { useGetRecentOrder } from "../../hooks/useOrders";
import Empty from "../../assets/empty.png";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAppSelector } from "../../hooks/useActions";
import { Icons } from "../../utils";
import { useViewPort } from "@/hooks";
import { Skeleton } from "@/helpers";

export const RecentOrder = () => {
  const store = useAppSelector();

  const { isVisible } = useViewPort();

  const { data, loading } = useGetRecentOrder(
    {
      pageSize: 5,
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: "next",
      filter: "orderFullfilled",
      userId: store?.auth?.userInfo?.uid as string,
      status: "completed",
      sort:"desc"
    },
    { enable: isVisible }
  );

  const recentCardReference = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  return (
    <div className="w-full relative group/recent h-full flex text-[var(--dark-text)]  flex-col gap-6 bg-[var--light-foreground] px-5 py-4   rounded items-start justify-center">
      <button onClick={() => navigate(-1)} className="flex  justify-start items-center gap-2">
        <Icons.chevronLeft className="size-5 mt-1" />
        <h1 className="sm:text-[25px] text-[21px] tracking-wider font-semibold ">
          Recent Orders
        </h1>
     </button>
      <div
        ref={recentCardReference}
        className="flex items-center w-full h-full gap-5 pb-4 overflow-x-auto item-scrollbar "
      >
        {!loading ? (
          data.length > 0 ? (
            data?.map((order) => <RecentCard key={order?.id} item={order} />)
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
              children={{
                className: "w-[300px] rounded-xl h-[180px]",
              }}
              className="w-full flex gap-5"
              count={5}
            />
          </div>
        )}
      </div>
      {data?.length > 5 && (
        <div className="absolute z-50 px-1 flex justify-between  w-full duration-200 right-0 gap-40  group-hover/recent:visible group-hover/recent:opacity-100 top-[8rem] sm:top-36">
          <button
            onClick={() => {
              recentCardReference.current?.scrollBy({
                behavior: "smooth",
                left: -300,
              });
            }}
            className=" p-2 hover:bg-[#68656541] duration-150 text-[var(--dark-text)] rounded-full "
          >
            <Icons.chevronLeft className=" text-gray-800 size-5 " />
          </button>
          <button
            onClick={() => {
              recentCardReference.current?.scrollBy({
                behavior: "smooth",
                left: 300,
              });
            }}
            className="p-2 hover:bg-[#68656541] duration-150  text-[var(--dark-text)] rounded-full "
          >
            <Icons.chevronRight className=" text-gray-800 size-5 " />
          </button>
        </div>
      )}
    </div>
  );
};
