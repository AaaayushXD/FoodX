import { useState } from "react";
import { Hook } from "../@types/hooks";

export const useHooks = <T, K extends Hook.HookType>(
  type: K
): Hook.HookReturn<T, K> => {
  const [selectedId, setSelectedId] = useState<string>();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 5,
    direction: "next" as "prev" | "next",
  });
  const [totalData, setTotalData] = useState<number>();
  const [data, setData] = useState<T>();
  const [orderId, setOrderId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  // reAuth
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );

  // commonly used Hooks
  const [loading, setLoading] = useState<boolean>(false);

  const hookMap = {
    reAuth: {
      email,
      setEmail,
      password,
      setPassword,
      show,
      setShow,
      passwordType,
      setPasswordType,
      loading,
      setLoading,
    },
    orderHistory: {
      data,
      setData,
      loading,
      setLoading,
      pagination,
      setPagination,
      selectedId,
      setIsCollapsed,
      isCollapsed,
      setSelectedId,
      setTotalData,
      totalData,
    },
    orderNotification: {
      orderId,
      setOrderId,
      open,
      setOpen,
      data,
      setData,
      
    },
  };

  return hookMap[type] as Hook.HookReturn<T, K>;

};
