import { useEffect, useRef, useState } from "react";

interface StatusChangerProp {
  status: "prepared" | "preparing" | "completed" | "cancelled" | "pending";
  statusFn: (status: Common.OrderStatus, id?: string) => void;
  isChangeStatus: () => void;
}

export const UpdateStatus: React.FC<StatusChangerProp> = ({
  status,
  statusFn,
  isChangeStatus,
}) => {
  const [showModal, setShowModal] = useState(true);

  const reference = useRef<HTMLDivElement>();
  
  const statusConfig = {
    pending: {
      label: "Pending",
      color: "bg-[var(--pending)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
    preparing: {
      label: "Preparing", 
      color: "bg-[var(--preparing)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
    prepared: {
      label: "Prepared",
      color: "bg-[var(--prepared)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
    completed: {
      label: "Completed",
      color: "bg-[var(--completed)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-[var(--cancelled)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
  };

  // Function to get available statuses based on current status
  const getAvailableStatuses = (currentStatus: Common.OrderStatus) => {
    const statusFlow = {
      pending: ["preparing", "cancelled", "completed", "prepared"],
      preparing: ["prepared", "cancelled", "completed"],
      prepared: ["completed", "cancelled"],
      completed: [], // No further status changes allowed
      cancelled: [], // No further status changes allowed
    };

    return statusFlow[currentStatus] || [];
  };

  const updateStatus = getAvailableStatuses(status);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        reference.current &&
        !reference.current?.contains(event.target as any)
      ) {
        setShowModal(false);
        isChangeStatus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [status, isChangeStatus]);

  return (
    <div
      ref={reference as any}
      className={`w-full flex p-1 duration-200 flex-col bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] shadow rounded-lg items-center ${
        showModal ? "visible" : "invisible"
      } `}
    >
      {updateStatus.map((status, index) => (
        <button
          className={`w-fit flex items-center tracking-wider gap-3 justify-start py-1.5 px-5 duration-150 hover:bg-[var(--light-background)] rounded-lg `}
          onClick={() => statusFn(status as Common.OrderStatus)}
          key={index}
        >
          <span
            className={` w-2 rounded-full h-2 ${
              status === "prepared"
                ? "bg-[var(--prepared)] "
                : status === "pending"
                ? "bg-[var(--pending)] "
                : status === "preparing"
                ? "bg-[var(--preparing)] "
                : status === "cancelled"
                ? "bg-[var(--cancelled)]"
                : status === "completed"
                ? "bg-[var(--completed)] "
                : ""
            } `}
          ></span>
          <span> {status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </button>
      ))}
    </div>
  );
};
