import dayjs from "dayjs";
import React, { useState } from "react";
import Avatar from "@/assets/logo/avatar.png";
import { getRemainingTime, toaster } from "@/utils";
import { useQueryClient } from "react-query";
import { ApiError, getChefByUid } from "@/helpers";
import toast from "react-hot-toast";
import { addNotification, updateTicket } from "@/services";
import { UpdateTiket } from "@/features";

interface TicketProp {
  date: string;
  uid?: string;
  description: string;
  title?: string;
  category: string;
  id?: string;
  status?: Common.TicketStatus;
}

export const RecentTicketCard: React.FC<TicketProp> = ({
  category,
  description,
  date,
  uid,
  status,
  id: t_id,
  title,
}) => {
  const queryClient = useQueryClient();
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [updatedTicket, setUpdatedTicket] = React.useState<Ui.TicketType>();
  const [cachedUser, setCachedUser] = useState<Auth.User | null>(null);

  const messages = {
    pending: {
      message: "Your ticket is pending. We'll get back to you shortly.",
      title: "Ticket Pending",
    },
    progress: {
      message: "We're working on your issue. Stay tuned for updates!",
      title: "Ticket In Progress",
    },
    resolved: {
      message: "Your issue has been resolved. Thanks for your patience!",
      title: "Ticket Resolved",
    },
    rejected: {
      message:
        "Unfortunately, your ticket was rejected. Please contact support for details.",
      title: "Ticket Rejected",
    },
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = queryClient.getQueryData<Auth.User>(["user", uid]);
      if (!user && uid) {
        const fetchedUser = await queryClient.fetchQuery(["user", uid], () =>
          getChefByUid(uid)
        );
        setCachedUser(fetchedUser);
      } else {
        setCachedUser(user as Auth.User);
      }
    };
    fetchUser();
  }, [uid, queryClient]);

  const ticketUpdate = async (id: string, newStatus: Common.TicketStatus) => {
    if (!uid) toast.error("Some thing went wrong");
    const toastLoader = toaster({
      icon: "loading",
      message: "Please wait...",
    });

    try {
      await updateTicket({ id: id, newStatus: newStatus });
      if (uid) {
        await addNotification({
          message: messages[newStatus].message,
          title: messages[newStatus].title,
          userId: uid as string,
        });
      }
      if (t_id === id) {
        setUpdatedTicket({
          category,
          date,
          description,
          id,
          title,
          status: newStatus,
          uid,
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50 ",
          icon: "error",
          message: error?.message,
          title: "Error",
        });
      }
    } finally {
      toast.dismiss(toastLoader);
    }
  };

  const statusStyles: {
    [key in Common.TicketStatus]: { bg: string; text: string };
  } = {
    pending: {
      bg: "bg-[#0000ff0c]",
      text: "text-[var(--primary-color)]",
    },
    progress: {
      bg: " bg-[#bb81150e] ",
      text: "text-[#bb8115]",
    },
    resolved: {
      bg: "bg-gradient-to-r from-green-400/5 to-green-500/5",
      text: "text-green-600",
    },
    rejected: {
      bg: "bg-gradient-to-r from-red-400/5 to-red-500/5",
      text: "text-red-600",
    },
  };

  return (
    <div className="min-w-[300px] w-full h-[173px] bg-[var(--light-foreground)] p-3 gap rounded-lg border-[1px] border-[var(--dark-border)] flex flex-col items-start justify-center gap-3">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center gap-2">
          <img
            className="w-12 h-12 rounded-full"
            loading="lazy"
            src={
              cachedUser?.avatar && cachedUser?.avatar?.length > 200
                ? cachedUser?.avatar
                : Avatar
            }
            alt="user"
          />
          <h1 className=" text-[17px] text-[var(--dark-text)] tracking-wide ">
            {cachedUser?.fullName || "user"}
          </h1>
        </div>
        <span className=" text-gray-400  text-xs ">
          {getRemainingTime(dayjs(date))}
        </span>
      </div>
      <div className="w-full text-[var(--dark-secondary-text)] tracking-wide text-sm ">
        {description?.length > 130
          ? description.substring(0, 80) + "..."
          : description}
      </div>
      <div className="w-full flex-wrap flex items-center sm:gap-0 justify-start gap-5 sm:justify-evenly">
        <p className=" text-[var(--green-text)] bg-[#41d6410c] text-sm p-1 rounded-full px-2 ">
          New
        </p>
        <div
          onClick={() => {
            setIsUpdate(!isUpdate);
            setId(t_id as string);
          }}
          className={`relative `}
        >
          <button
            className={`  ${
              statusStyles[updatedTicket?.status || status || "pending"].text
            }  tracking-wider  ${
              statusStyles[updatedTicket?.status || status || "pending"].bg
            } px-2 text-sm 
            p-1 rounded-full`}
          >
            {" "}
            {updatedTicket?.id === t_id
              ? updatedTicket &&
                updatedTicket!.status!.charAt(0).toUpperCase() +
                  updatedTicket?.status?.slice(1)
              : status && status?.charAt(0).toUpperCase() + status?.slice(1)}
          </button>
          <div
            className={` z-[100] top-[-7rem] bg-[var(--light-foreground)] absolute ${
              isUpdate && id.includes(t_id as string)
                ? "visible opacity-100 translate-x-0 "
                : "invisible opacity-0 translate-x-9 "
            }`}
          >
            <UpdateTiket
              isChangeStatus={() => setIsUpdate(false)}
              status={status as Common.TicketStatus}
              action={(newStatus) => ticketUpdate(id as string, newStatus)}
            />
          </div>
        </div>
        <p
          className={` p-1 bg-[#ffa60007] text-[#ff971f] px-2 tracking-wide rounded-full text-sm  `}
        >
          {category}
        </p>
      </div>
    </div>
  );
};
