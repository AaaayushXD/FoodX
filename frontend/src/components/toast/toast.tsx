import { Toast, toast } from "react-hot-toast";
import dayjs from "dayjs";
import { useState } from "react";

interface CustomToastProp {
  order: Model.Order;
  t : Toast
}
const CustomToast: React.FC<CustomToastProp> = ({ order,t }) => {
  // const { uid, products, orderFullfilled } = order;

  const [startX, setStartX] = useState<number>();
  const [currentX, setCurrentX] = useState<number>();
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    console.log(event);
    setStartX(event.touches[0].clientX);
    setIsSwapping(false);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startX !== null) {
      setCurrentX(event.touches[0].clientX);
      setIsSwapping(true);
    }
  };

  const handleTouchEnd = (t: Toast) => {
    if (startX !== null && currentX !== null) {
      toast.dismiss(t.id);
    }
  };

  const messages: { [key: string]: string } = {
    preparing:
      "Your order is being prepared. It won't be long until it's ready to enjoy.",
    prepared:
      "Your order is prepared. Thank you for waiting patiently. Please visit us to receive your order.",
    completed:
      "Your order has been completed. Thank you for ordering. Enjoy your meal!",
    cancelled: "Your order has been cancelled. Please visit us to support us.",
    pending : "our order is currently pending. Please stay tuned for updates!"
  };

  return (
    <div
    style={{
      transform: `translateX(${
        currentX && startX ? currentX - startX : 0
      }px)`,
      transition: isSwapping ? "none" : "transform 0.3s ease",
    }}
    onTouchStart={(event) => handleTouchStart(event)}
    onTouchMove={(event) => handleTouchMove(event)}
    onTouchEnd={() => handleTouchEnd(t)}
    className={` ${
      t.visible
        ? "visible opacity-100"
        : "invisible opacity-0 translate-x-48"
    } w-[380px] flex flex-col  translate-x-0 duration-150 items-start bg-white  justify-between gap-5 p-2 rounded-lg`}
  >
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col items-start justify-center">
        <h1 className=" text-[16px] tracking-wide ">
          Your order is {order.status} !!
        </h1>
        <p className="text-xs flex items-center gap-1 tracking-wide text-gray-400 ">
          Order ID:{" "}
          <span className="text-[10.4px] text-gray-500 ">{order.orderId}</span>
        </p>
      </div>
      <div className="text-xs flex flex-col items-start justify-center gap-1 text-gray-500 ">
        <p>
          {order.status === "completed"
            ? dayjs(order.orderFullfilled).format("YYYY-MM-DD")
            : dayjs(order.orderRequest).format("YYYY-MM-DD")}
        </p>
        <p>
          {order.status === "completed"
            ? dayjs(order.orderFullfilled).format("h:mm A")
            : dayjs(order.orderRequest).format("h:mm A")}
        </p>
      </div>
    </div>
    <p className="text-[14px] text-gray-500 ">
      {messages[order?.status as keyof typeof messages] ||
        "Status unknown."}
    </p>
  </div>
  )
};

export const showToast = (order: Model.Order) => {
  toast.custom((t) => <CustomToast t={t} order={order} />,{duration:10000,position:"top-right"});
};
