import React, { FormEvent, useRef, useState } from "react";

import { HashLoader } from "react-spinners";

import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import toast from "react-hot-toast";
import { createTicket } from "../../../services/ticket";
import { Selector } from "@/common";
import dayjs from "dayjs";
import { toaster } from "@/utils";
import { ApiError } from "@/helpers";

interface CreateTicketProp {
  close?: () => void;
}
export const CreateTicket: React.FC<CreateTicketProp> = ({ close }) => {
  const reference = useRef<HTMLDivElement>();
  const user = useSelector(
    (state: RootState) => state.root.user.userInfo
  ) as Auth.User;

  const [loading, setLoading] = useState<boolean>(false);
  const [initialTicket, setInitialTicket] = useState<Ui.TicketType>({
    title: "",
    category: "",
    description: "",
    date: dayjs().format("YYYY-MM-DD h:mm A"),
    status: "pending",
    uid: user?.uid as string,
    id: "",
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !initialTicket.category &&
      initialTicket.category &&
      !initialTicket.description
    )
      return toaster({
        icon: "error",
        className: "bg-red-50",
        message: "All fields are required",
        title: "Error",
      });

    setLoading(true);
    try {
      const response = await createTicket({ ...initialTicket ,ticketStatus: "pending"});

      toaster({
        icon: "success",
        className: "bg-green-50",
        message: response?.message,
        title: "Ticket successfully added!",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          icon: "error",
          className: "bg-red-50",
          message: error?.message,
          title: "Error",
        });
      }
    } finally {
      setLoading(false);
      setInitialTicket({
        category: "",
        description: "",
        id: "",
        title: "",
        date: "",
        uid: "",
      });
      close && close();
    }
  };
  
  const categoryOption: { value: string; label: string }[] = [
    { value: "ingredient_shortage", label: "Ingredient Shortage" },
    { value: "equipment_malfunction", label: "Equipment Malfunction" },
    { value: "staff_shortage", label: "Staff Shortage" },
    { value: "cleaning_required", label: "Cleaning Required" },
    { value: "menu_adjustment", label: "Menu Adjustment" },
  ];

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="w-full relative overflow-auto h-full flex-col gap-5 items-center justify-center flex"
      >
        <h3 className=" h-12 sticky tracking-wider border-[var(--dark-border)]  overflow-hidden  text-center  w-full border-b-[1px] text-[var(--dark-text)] text-[20px]">
          Create Ticket
        </h3>

        <form
          onSubmit={(event) => handleSubmit(event)}
          action=""
          className="sm:w-[600px]  text-[var(--dark-etx)]  w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Category
            </label>
            <Selector
              categoryOption={categoryOption}
              setField={(value) =>
                setInitialTicket((prev) => ({ ...prev, category: value }))
              }
            />
          </div>
          {/* Second Row */}
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Title
            </label>
            <input
              value={initialTicket.title}
              onChange={(event) =>
                setInitialTicket((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              type="text"
              className="w-full bg-[var(--light-foreground)] border-[var(--dark-border)] border-[1px] outline-none text-[var(--dark-text)] placeholder:text-sm py-2 px-4 rounded"
            />
          </div>
          {/* Third Row */}
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Description
            </label>
            <textarea
              value={initialTicket.description}
              onChange={(event) =>
                setInitialTicket((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Describe your request"
              className="w-full bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] h-[200px] resize-none text-[var(--dark-text)]  outline-none placeholder:text-sm py-2 px-4 rounded"
            />
          </div>

          <button className="w-full tracking-wider text-white transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                Sending <HashLoader color="white" size={"20px"} />
              </div>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};
