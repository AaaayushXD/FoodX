import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppSelector, useNotification } from "@/hooks";
import { Empty, Error } from "@/commons";
import { NotificationLoader, NotificationCard } from "@/components";

interface Notifications {
  isOpen: boolean;
}
export const NotificationPage: React.FC<Notifications> = ({ isOpen }) => {
  const {
    currentDoc,
    hasMore,
    data,
    error,
    fetchData,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useNotification({
    isOpen: isOpen,
  });

  return (
    <div className="p-2 w-full min-h-40 flex flex-col items-start justify-center bg-[var(--light-foreground)] border-[var(--dark-border)] border-[1px]  rounded-xl ">
      <h2 className=" py-2 mb-2 w-full  text-lg font-semibold">
        Notifications
      </h2>
      <button onClick={()=> fetchNextPage() }>
        fetch more
      </button>
      <div
        id="notification"
        className="w-full h-[350px] flex flex-col  scrollbar-custom   justify-stretch pr-4 "
      >
        {isLoading ? (
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
        ) : data?.pages[0]?.notifications.length <= 0 ? (
          <Empty title="You don't have any notification" />
        ) : (
          data?.pages[0]?.notifications?.map((notification, index) => (
            <NotificationCard
              key={index}
              isLoading={isLoading}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
};
