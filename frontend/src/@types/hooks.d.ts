import { SetStateAction } from "react";

declare namespace Hook {
  type HookType = "reAuth" | "orderHistory" | "orderNotification";

  // Define return types for each HookType
  type HookReturn<T, K extends HookType> = {
    reAuth: {
      email: string;
      setEmail: React.Dispatch<React.SetStateAction<string>>;
      password: string;
      setPassword: React.Dispatch<React.SetStateAction<string>>;
      show: boolean;
      setShow: React.Dispatch<React.SetStateAction<boolean>>;
      passwordType: "password" | "text";
      setPasswordType: React.Dispatch<
        React.SetStateAction<"password" | "text">
      >;
      loading: boolean;
      setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    };
    orderHistory: {
      selectedId?: string;
      setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
      isCollapsed: boolean;
      setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
      pagination: {
        currentPage: number;
        perPage: number;
        direction: "prev" | "next";
      };
      setPagination: React.Dispatch<
        React.SetStateAction<{
          currentPage: number;
          perPage: number;
          direction: "prev" | "next";
        }>
      >;
      totalData?: number;
      setTotalData: React.Dispatch<React.SetStateAction<number | undefined>>;
      loading: boolean;
      setLoading: React.Dispatch<React.SetStateAction<boolean>>;
      data?: T;
      setData: React.Dispatch<React.SetStateAction<T>>;
    };
    orderNotification: {
      orderId: string;
      setOrderId: React.Dispatch<React.SetStateAction<string>>;
      open: boolean;
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      data?: T;
      setData: React.Dispatch<React.SetStateAction<T | undefined>>;
    };
  }[K];
}
