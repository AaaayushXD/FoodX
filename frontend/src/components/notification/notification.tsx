import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppSelector, useNotification } from "@/hooks";
import { Empty, Error } from "@/common";
import { NotificationLoader, NotificationCard } from "@/components";
import { useInView } from "react-intersection-observer";

interface Notifications {
  isOpen: boolean;
}
export const NotificationPage: React.FC<Notifications> = ({ isOpen }) => {
  const {
    currentDoc,
    hasMore,
    fetchData,
    fetchNextPage,
    isError,
    loading,
    totalData,
  } = useNotification({
    isOpen: isOpen,
  });

  const { ref, inView } = useInView({
    rootMargin: "0px 0px 100px 0px",
    threshold: [1],
  });

  

  useEffect(() => {
    if (inView && hasMore && fetchData?.length + 1 !== totalData) {
      fetchNextPage({
        pageParam: {
          currentFirstDoc: currentDoc?.currentFirstDoc,
          currentLastDoc: currentDoc?.currentLastDoc,
        },
      });
    }
  }, [inView, fetchNextPage]);



  return (
    <div className="p-2 w-full min-h-40 flex flex-col items-start justify-center bg-[var(--light-foreground)] border-[var(--dark-border)] border-[1px]  rounded-xl ">
      <h2 className=" py-2 mb-2 w-full  text-lg font-semibold">
        Notifications
      </h2>

      <div
        id="notification"
        className="w-full h-[350px] flex flex-col  scrollbar-custom   justify-stretch pr-4 "
      >
        {loading ? (
          <NotificationLoader />
        ) : isError ? (
          <Error
            button={{
              onClick: () => fetchNextPage(),
              title: "Refresh",
            }}
            message={"Something went wrong"}
            title="Error"
          />
        ) : loading && fetchData?.length <= 0 ? (
          <NotificationLoader />
        ) : fetchData?.length <= 0 ? (
          <Empty title="You don't have any notification" />
        ) : (
          fetchData?.map((notification, index) => (
            <NotificationCard
              key={index}
              isLoading={loading}
              notification={notification}
            />
          ))
        )}
        <div className="w-full " ref={ref}>
          {loading && fetchData.length > 0 && <NotificationLoader />}
        </div>
      </div>
    </div>
  );
};
