import React from "react";

interface UpdateTiketProp {
  status: Common.TicketStatus;
  action: (newStatus: Common.TicketStatus) => Promise<void>;
  isChangeStatus: () => void;
}

export const UpdateTiket: React.FC<UpdateTiketProp> = ({
  action,
  isChangeStatus,
  status,
}) => {
  const reference = React.useRef<HTMLDivElement | null>(null);
  const Status: Common.TicketStatus[] = [
    "pending",
    "progress",
    "rejected",
    "resolved",
  ];
  const updateStatus = Status.filter((sts) => sts !== status);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as Node)
      ) {
        isChangeStatus(); // Close the modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChangeStatus]);

  return (
    <div
      ref={reference}
      className={` flex p-1 duration-200 flex-col bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] shadow rounded-lg items-center  `}
    >
      {updateStatus.map((status, index) => (
        <button
          className={`w-[150px] flex items-center tracking-wider gap-3 justify-start py-1.5 px-5 duration-150 hover:bg-[var(--light-background)] rounded-lg `}
          onClick={() => action(status)}
          key={index}
        >
          <span
            className={` w-2 rounded-full h-2 ${
              status === "pending"
                ? "bg-[var(--prepared)] "
                : status === "progress"
                ? "bg-[var(--pending)] "
                : status === "rejected"
                ? "bg-[var(--cancelled)]"
                : status === "resolved"
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
