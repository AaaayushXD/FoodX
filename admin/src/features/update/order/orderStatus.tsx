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
  const Status = ["preparing", "prepared", "pending", "cancelled", "completed"];
  const updateStatus = Status.filter((sts) => sts !== status);

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
          className={`w-[150px] flex items-center tracking-wider gap-3 justify-start py-1.5 px-5 duration-150 hover:bg-[var(--light-background)] rounded-lg `}
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
