import React from "react";
import { MobileNavbar, showToast } from "../components";
const Footer = React.lazy(() =>
  import("../components").then((module) => ({
    default: module.Footer,
  }))
);
import useScrollToTop from "../hooks/scrollToTop";
import { useAppDispatch, useAppSelector } from "../hooks/useActions";
import { updateOrder } from "../reducer";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSocket } from "../utils/socket";
import Bell from "../assets/order.mp3";
import ErrorBoundary from "@/errorBoundary";

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector();

  const { socket } = useSocket(store?.auth?.success);
  useEffect(() => {
    const handleNotification = async (order: Model.Order) => {
      try {
        dispatch(updateOrder({ ...order }));
        const audio = new Audio(Bell);
        await audio.play().catch((err) => console.log(err));
        showToast(order);
      } catch (error) {
        console.error("Error while getting info of update order", error);
      }
    };

    // Set up the socket event listener
    socket?.on("order_status", handleNotification);

    // Cleanup: Disconnect on logout or unmount
    return () => {
      socket?.off("order_status", handleNotification);
    };
  }, [socket]);

  useScrollToTop();

  return (
    <div className="flex items-center !overflow-x-hidden justify-center w-full h-full min-w-[100vw]  ">
      <ErrorBoundary>
        <div className="w-full  h-full max-w-[1500px] flex flex-col justify-center items-center ">
          <div className="w-full">
            <Outlet />
          </div>
          <div className="w-screen">
            <Footer />
          </div>

          <MobileNavbar />
        </div>
      </ErrorBoundary>
    </div>
  );
};
