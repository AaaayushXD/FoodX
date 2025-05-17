import React, { useEffect, useState } from "react";
import { fetchNotifications } from "@/services";
import InfiniteScroll from "react-infinite-scroll-component";
import { RotatingLines } from "react-loader-spinner";
import dayjs from "dayjs";
import { getRemainingTime, Icons } from "@/utils";
import { useAppSelector } from "@/hooks";
import { ApiError } from "@/helpers";

interface Notifications {
  isOpen: boolean;
}
export const NotificationPage: React.FC<Notifications> = ({ isOpen }) => {
  const [notifications, setNotifications] = useState<Model.Notification[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>();
  const [loader, setLoader] = useState<boolean>(false);

  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();

  const { user } = useAppSelector();

  const getNotification = async ({
    uid,
    currentFirstDoc,
    currentLastDoc,
    pageSize,
    sort,
    direction,
  }: Api.FetchPaginate<keyof Ui.Order, Common.OrderStatus>) => {
    setLoader(true);
    try {
      const response = await fetchNotifications({
        uid,
        currentFirstDoc,
        currentLastDoc,
        pageSize,
        sort,
        direction,
      });
      setCurrentDoc({
        currentFirstDoc: response.data?.currentFirstDoc,
        currentLastDoc: response.data?.currentLastDoc,
      });
      if (response.data?.notifications.length < 4) setHasMore(false);
      setTotalData(response.data?.notifications.length);
      setNotifications((prev) => {
        return prev
          ? [
              ...prev,
              ...response.data.notifications.filter((notification) =>
                prev.every((value) => value.id !== notification.id)
              ),
            ]
          : response.data?.notifications;
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(error?.message);
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getNotification({
        uid: user.userInfo?.uid,
        currentFirstDoc: null,
        currentLastDoc: null,
        pageSize: 10,
        sort: "desc",
        direction: "next",
      });
    }
  }, [isOpen, user?.userInfo?.uid]);

  return (
    <div className="p-4 w-full  min-w-[400px] min-h-40  bg-[var(--light-foreground)] border-[var(--dark-border)] border-[1px]  rounded-xl ">
      <h2 className="mb-4 text-lg text-[var(--dark-text)] font-semibold">
        Notifications
      </h2>
      <div
        id="notification"
        className="w-full h-[350px] flex   justify-center pr-4 scrollbar-custom"
      >
        <InfiniteScroll
          scrollableTarget={"notification"}
          hasMore={hasMore}
          dataLength={(totalData as number) || 0}
          next={() =>
            getNotification({
              currentFirstDoc: currentDoc?.currentFirstDoc || null,
              currentLastDoc: currentDoc?.currentLastDoc || null,
              pageSize: 10,
              sort: "desc",
              uid: user.userInfo?.uid as string,
              direction: "next",
            })
          }
          loader={
            loader && (
              <div className="flex flex-col h-full  items-center justify-center w-full pt-3 ">
                {/* <Skeleton height={70} count={5} /> */}
                <div className="flex items-center w-full h-full pt-28 justify-center gap-3">
                  <RotatingLines strokeColor="var(--dark-text)" width="27" />
                  <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
                    {" "}
                    loading...
                  </span>
                </div>
              </div>
            )
          }
        >
          {!loader && notifications?.length <= 0 ? (
            <p className="text-[var(--dark-secondary-text)]  w-full  mt-28 text-[18px] h-full flex items-center justify-center py-6">
              No notifications available.
            </p>
          ) : (
            notifications?.map((notification) => (
              <NoticationContainer
                key={notification.id}
                isLoading={loader}
                notification={notification}
              />
            ))
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

interface NotificationProp {
  notification: Model.Notification;
  closeNotification?: (id: string) => void;
  isLoading: boolean;
}
const NoticationContainer: React.FC<NotificationProp> = ({ notification }) => {
  const [openId, setOpenId] = useState<string>("");

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <div
      onClick={() => handleToggle(notification.id)}
      key={notification.uid}
      className="relative  min-w-[344px] flex flex-col p-2 mb-4 bg-[var(--light-foreground)] rounded-lg shadow-md border border-[var(--dark-border)] transition-transform duration-150"
    >
      {/* Notification Header */}
      <div
        // onClick={() => handleToggle(notification.id)}
        className="flex items-center justify-between cursor-pointer w-full"
      >
        <div className="flex items-start gap-3">
          <div className="bg-blue-500  p-2 rounded-full flex items-center justify-center text-white">
            {/* Placeholder icon or notification type icon */}
            <Icons.bell className="text-white size-5 " />
          </div>
          <div>
            <h4 className="text-[15px] text-[var(--dark-text)] font-semibold">
              {notification.title}
            </h4>
            <p className="text-xs text-[var(--dark-secondary-text)]">
              {notification.id}
            </p>
          </div>
        </div>
      </div>

      {/* Notification Message */}
      <p
        className={`text-sm cursor-pointer text-gray-400 mt-2 transition-all duration-300 overflow-hidden ${
          openId === notification.id ? "max-h-[500px] " : " "
        }`}
      >
        {openId === notification.id
          ? notification.message
          : notification.message.substring(0, 40) + "..."}
      </p>

      {/* Chevron Icon and Time */}
      <div className="flex justify-end items-center pt-2 text-xs text-[var(--dark-secondary-text)]">
        <span>
          {getRemainingTime(dayjs.unix(notification!.createdAt!._seconds))} ago
        </span>
      </div>
    </div>
  );
};
