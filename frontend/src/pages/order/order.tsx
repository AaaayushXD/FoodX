import {  OrderHistory, RecentOrder } from '@/components';

export const Order = () => {
  return (
    <div className="hidden sm:flex flex-col items-start gap-10 py-5 justify-center w-full h-full ">
      <div className="flex items-center w-full  gap-5 overflow-x-auto ">
        <RecentOrder />
      </div>
      <OrderHistory />
    </div>
  );
};

