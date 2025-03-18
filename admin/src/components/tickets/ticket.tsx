import React from "react";
import TicketCard from "../card/ticket/ticket";
import { Skeleton } from "@/helpers";

interface PendingProp {
  prop: Ui.TicketType[];
  loading?: boolean;
  title: string;
}

export const Ticket: React.FC<PendingProp> = ({ prop, loading, title }) => {
  return loading ? (
    <Skeleton
      children={{
        className: " w-full h-[200px] rounded-lg ",
      }}
      className=" w-full h-full flex flex-col items-start justify-start gap-3 "
      count={2}
    />
  ) : prop.length > 0 ? (
    <div className="flex flex-col px-2 sm:px-3 py-2 items-start gap-2  justify-center rounded  ">
      <div className="w-full border-b-[1px] pb-5 flex items-center justify-between px-2">
        <h1 className="text-[20px] tracking-wider text-[var(--dark-text)] ">
          {title}
        </h1>
      </div>
      <div className="w-full flex flex-col  gap-2">
        {prop?.map((ticket) => (
          <TicketCard
            category={ticket.category}
            date={ticket.date as any}
            description={ticket.description}
            title={ticket?.title as string}
            id={ticket.id}
            key={ticket.id}
          />
        ))}
      </div>
    </div>
  ) : (
    ""
  );
};