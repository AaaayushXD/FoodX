import dayjs from "dayjs";
import { getRemainingTime } from "@/helpers/date.utility";
import { Icons } from "@/utils";
import { useState } from "react";

interface NotificationProp {
  notification: Model.Notification;
  closeNotification?: (id: string) => void;
  isLoading: boolean;
}

export const NotificationCard: React.FC<NotificationProp> = ({
  notification,
}) => {
  const [openId, setOpenId] = useState<string>("");

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <div
      onClick={() => handleToggle(notification.id)}
      key={notification.uid}
      className="relative  w-full flex  flex-col items-start justify-start gap-2 border-b py-3"
    >
      {/* Notification Header */}
      <div
        // onClick={() => handleToggle(notification.id)}
        className="flex items-center justify-between cursor-pointer w-full"
      >
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 p-2 rounded-full flex items-center justify-center text-white">
            {/* Placeholder icon or notification type icon */}
            <Icons.bell className="text-white size-5 " />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold">{notification.title}</h4>
            <p className="text-xs text-[var(--dark-secondary-text)]">
              {notification.id}
            </p>
          </div>
        </div>
      </div>

      {/* Notification Message */}
      <p
        className={`text-sm cursor-pointer text-gray-400 mt-2  transition-all duration-300 overflow-hidden ${
          openId === notification.id ? " " : "line-clamp-2 "
        }`}
      >
        {notification?.message}
      </p>

      {/* Chevron Icon and Time */}
      <div className="flex justify-end items-center pt-2 text-xs text-[var(--dark-secondary-text)]">
        <span>
          {getRemainingTime(dayjs.unix(notification?.createdAt._seconds))} ago
        </span>
      </div>
    </div>
  );
};
