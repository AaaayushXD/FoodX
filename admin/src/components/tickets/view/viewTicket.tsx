import React from "react";


interface TicketViewProp {
  item: Ui.TicketType;
}
export const TicketView: React.FC<TicketViewProp> = ({ item }) => {
  return (
    <div className="w-full flex flex-col  pt-2 px-3 justify-between gap-5 ">
      <h1 className=" text-2xl  text-[var(--dark-text)] tracking-wider pb-3 w-full text-center border-b border-[var(--dark-border)] ">Ticket Overview</h1>
      <div className="flex flex-col pt-4 items-start gap-1 justify-center">
        <h1 className=" text-[20px] tracking-wide font-semibold text-[var(--dark-text)] ">
          {item.title}
        </h1>
        <h2 className=" text-[17px] tracking-wide text-[var(--dark-secondary-text)] ">
          {item.category}{" "}
        </h2>
      </div>
      <div className="w-full h-full pt-4 flex flex-col justify-between gap-4">
        <textarea value={item.description} readOnly className=" rounded-lg p-2 text-[var(--dark-text)] text-[16px] outline-none bg-[var(--light-forground)] border-[1px] border-[var(--dark-border)] " cols={80} rows={10}>
          
      </textarea>
        <span className=" text-[14px] text-[var(--dark-secondary-text)] ">
          Created by {item.name} at {item.date}
        </span>
      </div>
    </div>
  );
};

