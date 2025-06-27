import { useNotification, useViewPort } from "@/hooks";
import { Icons } from "@/utils";
import { NotificationCard, NotificationLoader } from "@/components";
import { useNavigate } from "react-router-dom";
import { Empty } from "@/common";
import { useEffect } from "react";
import { Error } from "@/common";
import { useInView } from "react-intersection-observer";

export const MobileNotification = () => {
  const { isVisible } = useViewPort();
  const { hasMore, fetchData, fetchNextPage, isError, isLoading } =
    useNotification({ isOpen: isVisible });

  const { ref, inView } = useInView({
    rootMargin: "0px 0px 100px 0px",
    threshold: [1],
  });

  useEffect(() => {
    if (inView && hasMore) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const navigate = useNavigate();

  return (
    <div
      id="notification"
      className="w-full flex flex-col items-start justify-start gap-10 py-5 px-2"
    >
      <div className="w-full fixed top-0 right-0 left-0  py-4 z-[100] bg-white flex  items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <Icons.arrowLeft className="text-gray-800" />
        </button>
        <h1 className=" font-semibold text-[16px] text-[var(--secondary-text)] sm:text-[20px] ">
          Notications
        </h1>
        <div></div>
      </div>
      <div className="w-full pt-16 flex flex-col items-start justify-start gap-5">
        {isError ? (
          <Error
            button={{
              onClick: () => fetchNextPage(),
              title: "Refresh",
            }}
            message={"Something went wrong"}
            title="Error"
          />
        ) : isLoading ? (
          <NotificationLoader />
        ) : fetchData.length <= 0 ? (
          <Empty
          icons={
            <div className="flex items-center justify-center p-3 rounded-full bg-red-500/10">
              <Icons.emptyNotification className="size-6 sm:size-7 text-red-500" />
            </div>
          }
          title="No Notifications"
          description="You're all caught up! Check back later for updates."
        />
        
        ) : (
          fetchData?.map((notification) => (
            <NotificationCard
              key={notification.id}
              isLoading={isLoading}
              notification={notification}
            />
          ))
        )}
      </div>
      <div className="w-full " ref={ref}>
        {isLoading && fetchData.length > 0 && <NotificationLoader />}
      </div>
    </div>
  );
};
