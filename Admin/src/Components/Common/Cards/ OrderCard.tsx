import React from "react";
import { RecentOrderType } from "../../../models/order.model";
import { convertIsoToReadableDateTime } from "../../../Utility/DateUtils";

// interface OrderCardProps {
//   orderId: string;
//   items: [name: string, quantity: number];
//   price: number;
//   status: string;
//   date: Date;
// }

export const OrderCard: React.FC<RecentOrderType> = ({
  orderId,
  image,
  products,
  price,
  status,
  orderRequest,
}) => {
  const ogDate = convertIsoToReadableDateTime(orderRequest);


  return (
    <div className="flex items-center justify-between flex-shrink-0 w-full h-full gap-5 p-3 border border-[var(--light-secondary-background)] rounded-md min-w-[500px]">
      <div className="flex w-full items-center justify-start gap-3">
        <div className="w-[40px] h-[40px] ">
         <img src={image} className="w-full rounded-full  h-full" alt="" />
        </div>
        <div className="flex flex-col items-start justify-center ">
          <p className="text-xs text-[var(--dark-secondary-text)] pb-1">
            {orderId}
          </p>

          <p className="text-sm text-[var(--dark-secondary-text)] pb-3">
            {products}
          </p>
          <p className="text-lg text-[var(--dark-text)] font-semibold tracking-wide">
            Rs <span>{price}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-3 text-xs">
        <p className="p-2 text-[var(--light-text)] rounded cursor-pointer bg-[var(--green-bg)]">
          {status}
        </p>
        <div className="text-xs text-[var(--dark-secondary-text)] pb-1 flex flex-col items-start justify-center">
          <p>{ogDate.date}</p>
          <p>
            {ogDate.time} <span>PM</span>
          </p>
        </div>
      </div>
    </div>
  );
};
