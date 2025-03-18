import React, { useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../../../services/order";
import { addNotification } from "../../../services/notification";
import Avatar from "../../../assets/logo/avatar.png";
import { UpdateStatus } from "@/features";
import { toaster } from "@/utils";
import { ApiError } from "@/helpers";

// interface OrderCardProps {
//   orderId: string;
//   items: [name: string, quantity: number];
//   price: number;
//   status: string;
//   date: Date;
// }

export const OrderCard: React.FC<Prop.RecentOrderProp> = ({
  orderId,
  image,
  products,
  price,
  status,
  orderRequest,
  uid,
}) => {
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [isNewStatus, setIsNewStatus] = useState<Common.OrderStatus>(status);

  const ogDate = dayjs(orderRequest).format("h:mm:ss A");

  const message = {
    completed: "Your order has been successfully completed.",
    cancelled:
      "Your order has been cancelled. Please contact customer support for assistance.",
  };

  const statusChangeFn = async (newStatus: Common.OrderStatus) => {
    if (!newStatus && !id) return toast.error("Order doesn't exist");
    const toastLoader = toaster({
      icon: "loading",
      message: "Please wait...",
    });

    try {
      const response = await updateOrderStatus({
        id: id as string,
        status: newStatus!,
        price: id === orderId ? price : 0,
        userId: uid as string,
      });
      if (response?.message)
        toaster({
          className: "bg-green-50",
          icon: "success",
          message: response?.message,
          title: "Order successfully updated!",
        });
      if (newStatus === "completed" || newStatus === "cancelled") {
        await addNotification({
          message: message[newStatus],
          title: "Order " + newStatus,
          uid: uid as string,
        });
      }
      setIsNewStatus(newStatus!);
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-green-50 ",
          icon: "error",
          message: error?.message,
          title: "Error",
        });
      }
    } finally {
      toast.dismiss(toastLoader);
      setIsChangeStatus(false);
    }
  };

  return (
    <div className="flex items-center justify-between flex-shrink-0 w-full h-full gap-5 p-3 border border-[var(--dark-border)] rounded-md min-w-[500px]">
      <div className="flex w-full items-center justify-start gap-3">
        <div className="w-[40px] h-[40px] ">
          <img
            src={image.includes("assets") ? Avatar : image}
            loading="lazy"
            className="w-full max-w-[50px] rounded-full max-h-[50px]  h-full"
            alt="order"
          />
        </div>
        <div className="flex flex-col items-start justify-center ">
          <p className="text-xs text-[var(--dark-secondary-text)] pb-1">
            {orderId}
          </p>

          <p className="text-sm text-[var(--dark-secondary-text)] pb-3">
            {products?.map(
              (product) => `${product.name} × ${product?.quantity}, `
            )}
          </p>
          <p className="text-lg text-[var(--dark-text)] font-semibold tracking-wide">
            Rs <span>{price}</span>
          </p>
        </div>
      </div>
      <div className="flex relative flex-col w-[80px] items-start justify-between gap-3 text-xs">
        <p
          onClick={() => {
            setIsChangeStatus(!isChangeStatus);
            setId(orderId);
          }}
          className="p-2 w-full  text-[var(--dark-text)] tracking-wide rounded cursor-pointer bg-[var(--green-bg)]"
        >
          {isNewStatus &&
            isNewStatus?.charAt(0).toUpperCase() + isNewStatus?.slice(1)}
        </p>
        <div className="absolute text-[var(--dark-text)] text-[16px] left-[-5rem] top-[-0.8rem]  z-[1000]">
          {" "}
          {isChangeStatus && id === orderId && (
            <UpdateStatus
              isChangeStatus={() => setIsChangeStatus(false)}
              status={status!}
              statusFn={(newStatus: Common.OrderStatus) =>
                statusChangeFn(newStatus)
              }
            />
          )}
        </div>
        <div className="text-xs  text-[var(--dark-secondary-text)] pb-1 flex flex-col items-start justify-center">
          <p>{ogDate}</p>
        </div>
      </div>
    </div>
  );
};
