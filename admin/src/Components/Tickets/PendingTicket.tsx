import React from "react";
import TicketCard from "./TicketCard";
import { TicketType } from "../../models/ticket.model";
import Skeleton from "react-loading-skeleton";

interface PendingProp {
  prop: TicketType[];
  loading?: boolean;
}

const PendingTicket: React.FC<PendingProp> = ({ prop, loading }) => {
 
  return loading ? (
    <div className="w-full ">
      <Skeleton
        height={100}
        baseColor="var(--light-background)"
        highlightColor="var(--light-foreground)"
        count={1}
      />
      <Skeleton
        height={80}
        baseColor="var(--light-background)"
        highlightColor="var(--light-foreground)"
        count={3}
      />
    </div>
  ) : prop.length > 0 ? (
    <div className="flex flex-col px-2 sm:px-3 py-2 items-start gap-2  justify-center rounded  ">
      <div className="w-full border-b-[1px] pb-5 flex items-center justify-between px-2">
        <h1 className="text-[20px] tracking-wider text-[var(--dark-text)] ">Pending</h1>
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

export default PendingTicket;
