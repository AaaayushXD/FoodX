import { useAppSelector } from "@/hooks/useActions";
import { Icons } from "@/utils";
import { useState } from "react";

export const TotalPay = () => {
  const { cart } = useAppSelector();

  const [showCost, setShowCost] = useState<boolean>(false);

  const totalAmount = cart?.products?.reduce(
    (productAcc, product) => productAcc + product.price * product.quantity,
    0
  );

  const costData: { title: string; amount: number }[] = [
    {
      title: "Item Total",
      amount: totalAmount,
    },
    {
      title: "Service Charge",
      amount: 0,
    },
  ];

  return (
    <div className="max-w-lg  w-full bg-white rounded-xl ">
      <div className="w-full flex items-center justify-between p-2">
        <div className="flex items-center gap-2 justify-start">
          <button className=" p-1 rounded-lg bg-green-600 ">
            <Icons.bill className=" sm:size-5 text-white size-4" />
          </button>
          <p className="flex flex-col items-start">
            <span className=" text-[14px] sm:text-[16px] font-semibold ">To Pay Rs.{totalAmount}</span>
            <span className=" text-[var(--secondary-text)] text-[12px] sm:text-[14px] ">Incl. all taxes & charges</span>
          </p>
        </div>
        <button onClick={() => setShowCost(!showCost)}>
          <Icons.chevronDown
            className={`size-4 duration-150 sm:size-5 ${
              showCost ? "rotate-180" : ""
            } `}
          />
        </button>
      </div>
      <div
        className={` w-full duration-150 flex px-2 flex-col items-start justify-start gap-1 ${
          showCost
            ? "h-[110px] visible opacity-100 "
            : "h-0 invisible opacity-0 "
        } `}
      >
        {costData?.map((cost, index) => (
          <CostComponent key={index} amount={cost.amount} title={cost.title} />
        ))}
        <div className="w-full border-t-[1.5px] border-dashed pt-2 flex items-center justify-between ">
          <h1>To Pay</h1>
          <span>
            Rs.
            {costData?.reduce((costAcc, cost) => costAcc + cost.amount, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

const CostComponent = ({
  title,
  amount,
}: {
  title: string;
  amount: number;
}) => {
  return (
    <div className="w-full flex items-center justify-between">
      <h1 className=" text-gray-400 text-[14px] sm:text-[16px] ">{title}</h1>
      <p className=" text-gray-600 text-[15px] sm:text-[17px] ">Rs.{amount}</p>
    </div>
  );
};
