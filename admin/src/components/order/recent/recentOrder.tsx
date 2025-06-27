import { useEffect, useState } from "react";
import { Empty, Loader } from "@/common";
import Bell from "@/assets/order.mp3";
import { useSocket, Icons, toaster } from "@/utils";
import { OrderCard } from "@/components";
import { useAppSelector, usePaginateOrders } from "@/hooks";
import { aggregateOrders, getUserByUid, ApiError } from "@/helpers";
import { customToast } from "@/common/toast/toast";
import { updateOrderStatus, addNotification } from "@/services";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";

export const RecentOrders = () => {
  const [url, setUrl] = useState<string>();

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const { initialOrders, setInitialOrders, loading } = usePaginateOrders({
    pageSize: 5,
    sort: "desc",
    status: "pending",
    direction: "next",
  });

  const { user } = useAppSelector();
  const { socket, loading: loader } = useSocket(user?.success);

  useEffect(() => {
    if (!loader) {
      const handleNewOrder = async (order: Ui.Order) => {
        const user = await getUserByUid(order.uid as string);

        const aggregateOrder = aggregateOrders([order]);
        const promiseResolve = await Promise.all(aggregateOrder);
        setInitialOrders((prev) => [...promiseResolve, ...prev]);

        // Enhanced toast with actions
        customToast({
          orderId: order.orderId,
          products: order.products,
          orderRequest: order.orderRequest,
          name: user?.fullName as string,
          note: order.note as string,
          paymentMethod: order.paymentMethod,
        }, {
          onAccept: async (orderId: string) => {
            const toastLoader = toaster({
              icon: "loading",
              message: "Accepting order...",
            });

            try {
              const user = await getUserByUid(order.uid as string);
              const response = await updateOrderStatus({
                id: orderId,
                status: "preparing",
                price: order.products?.reduce(
                  (productAcc, product) =>
                    productAcc + Number(product.price) * Number(product.quantity),
                  0
                ),
                uid: order.uid as string,
                role: user?.role as Auth.UserRole,
              });
              setInitialOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: "preparing" } : order));

              if (response?.message) {
                toaster({
                  className: "bg-green-50",
                  icon: "success",
                  message: response?.message,
                  title: "Order accepted successfully!",
                });
              }
            } catch (error) {
              if (error instanceof ApiError) {
                toaster({
                  className: "bg-red-50",
                  icon: "error",
                  message: error?.message,
                  title: "Error accepting order",
                });
              }
            } finally {
              toast.dismiss(toastLoader);
            }
          },
          onReject: async (orderId: string) => {
            const toastLoader = toaster({
              icon: "loading",
              message: "Rejecting order...",
            });

            try {
              const user = await getUserByUid(order.uid as string);
              const response = await updateOrderStatus({
                id: orderId,
                status: "cancelled",
                price: order.products?.reduce(
                  (productAcc, product) =>
                    productAcc + Number(product.price) * Number(product.quantity),
                  0
                ),
                uid: order.uid as string,
                role: user?.role as Auth.UserRole,
              });

              if (response?.message) {
                toaster({
                  className: "bg-green-50",
                  icon: "success",
                  message: response?.message,
                  title: "Order rejected successfully!",
                });
              }

              // Send notification to user
              await addNotification({
                message: "Your order has been cancelled. Please contact customer support for assistance.",
                title: "Order Cancelled",
                uid: order.uid as string,
              });
            } catch (error) {
              if (error instanceof ApiError) {
                toaster({
                  className: "bg-red-50",
                  icon: "error",
                  message: error?.message,
                  title: "Error rejecting order",
                });
              }
            } finally {
              toast.dismiss(toastLoader);
            }
          },
          onView: (orderId: string) => {

            setUrl("order-list");
          },
        });
      };

      // Listen for the 'new_order' event
      socket?.on("new_order", handleNewOrder);

      // Cleanup listener when component unmounts
      return () => {
        socket?.off("new_order", handleNewOrder);
      };
    }
  }, [socket, setInitialOrders, loader]);4



  return (
    <div className={`flex flex-col px-2 py-4 w-full h-full   ${user?.userInfo?.role === "admin" ? "lg:max-w-[600px]" : "w-full"}`}>
      <div className="flex items-center justify-between pb-7">
        <h2 className="text-2xl text-[var(--dark-text)] tracking-wide text-nowrap">
          Recent Orders
        </h2>
        <div className="flex items-center gap-3">
          {/* Test button for enhanced toast */}
          {/* <button
            onClick={testEnhancedToast}
            className="px-3 py-1 text-xs bg-[var(--primary-color)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors"
          >
            Test Toast
          </button> */}
          <p className="flex items-center justify-center text-[12px] cursor-pointer hover:underline text-[var(--primary-color)] flex-nowrap">
            <span className="text-nowrap" onClick={() => setUrl("order-list")}>
              View More
            </span>
            <Icons.chevronRight size={15} />
          </p>
        </div>
      </div>
      <div
        className={`duration-200 max-h-[550px] scrollbar-custom pr-4 overflow-y-scroll
         `}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-2 scroll-smooth ">
          {!loading ? (
            initialOrders.length > 0 ? (
              initialOrders?.map((order, index) => (
                <OrderCard
                  note={order?.note as string}
                  name={order?.name as string}
                  paymentMethod={order?.paymentMethod as "cash" | "online"}
                  paymentImage={order?.paymentImage as string}
                  uid={order?.uid as string}
                  image={order?.image as string}
                  
                  orderId={order?.id as string}
                  price={order.products?.reduce(
                    (productAcc, product) =>
                      productAcc +
                      Number(product.price) * Number(product.quantity),
                    0
                  )}
                  orderRequest={order?.orderRequest}
                  products={order?.products}
                  status={order?.status as Common.OrderStatus}
                  key={index}
                />
              ))
            ) : (
              <Empty
                action={() => setIsClicked(!isClicked)}
                children="No recent orders available"
              />
            )
          ) : (
            <div className="w-full">
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
            </div>
          )}
        </div>
      </div>
      {url && <Loader url={`${url}/`} />}
    </div>
  );
};