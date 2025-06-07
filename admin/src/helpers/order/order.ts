import dayjs from "dayjs";
import {
  addNotification,
  getRevenue as getRevenues,
  updateOrderStatus,
} from "@/services";
import { toaster } from "@/utils";
import { getUserByUid } from "../user/user";
import { ApiError } from "../error/apiError";
import toast from "react-hot-toast";

export const getOrderId = async () => {
  const orders = await getRevenues({
    startDate: dayjs().startOf("month").toISOString(),
    endDate: dayjs().toISOString(),
  });
  const totalOrders = orders as Ui.Order[];
  const orderId = totalOrders?.map((order) => order.orderId);
  return orderId;
};

export const getOrder = (orders: Ui.Product[]) => {
  const order = orders?.reduce(
    (OrderQuan, od) => OrderQuan + Number(od?.quantity),
    1
  );
  return order;
};

export const SearchOrder = (Order: Ui.OrderModal[], value: string) => {
  const searchingProduct = Order?.filter((order) => {
    return order.name && order?.name.toLowerCase().includes(value);
  });
  return searchingProduct;
};

const message = {
  completed: "Your order has been successfully completed.",
  cancelled:
    "Your order has been cancelled. Please contact customer support for assistance.",
};

export const statusChangeFn = async (
  newStatus: Common.OrderStatus,
  uid: string,
  id: string,
  orderId: string,
  price: number
) => {
  if (!newStatus && !id) {
    return toaster({
      className: "bg-red-50",
      icon: "error",
      message: "Order doesn't exist",
      title: "Error",
    });
  }
  const toastLoader = toaster({
    icon: "loading",
    message: "Please wait...",
  });
  const user = await getUserByUid(uid as string);
  try {
    const response = await updateOrderStatus({
      id: id as string,
      status: newStatus,
      price: id === orderId ? price : 0,
      uid: uid as string,
      role: user?.role as Auth.UserRole,
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
  
  }
};
