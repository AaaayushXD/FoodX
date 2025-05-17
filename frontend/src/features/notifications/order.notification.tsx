import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { removeOrder, addOrder } from "@/reducer";
import {
  useHooks,
  useAppDispatch,
  useAppSelector,
  useGetRecentOrder,
} from "@/hooks";

export const OrderNotification = () => {
  const {
    orderId,
    setOrderId,
    open,
    setOpen,
    data: initialData,
    setData,
  } = useHooks<Model.Order[], "orderNotification">("orderNotification");

  const dispatch = useAppDispatch();
  const store = useAppSelector();

  const { data, loading } = useGetRecentOrder(
    {
      pageSize: 5,
      direction: "next",
      filter: "orderRequest",
      userId: store?.auth?.userInfo?.uid,
    },
    { enable: !store?.order?.order.length && store?.auth?.success }
  );

  // useEffect(() => {
  //   if (data.length && !loading) {
  //     data?.forEach((order) => {
  //       if (order.status !== "completed") {
  //         dispatch(
  //           addOrder({
  //             orderId: order.id,
  //             products: order.products,
  //             status: order.status,
  //             orderRequest: order.time, // orderRequest
  //           })
  //         );
  //       }
  //     });
  //   }
  // }, [loading]);

  useEffect(() => {
    setData(store?.order?.order);
  }, [store.order.order]);

  const orderStatus: Model.OrderStatus[] = [
    "pending",
    "prepared",
    "prepared",
    "completed",
  ];

  const statusSteps = {
    pending: 0,
    preparing: 1,
    prepared: 2,
    completed: 3,
  };

  useEffect(() => {
    store?.order?.order?.forEach((order) => {
      if (order.status === "completed" || order.status === "cancelled") {
        setTimeout(() => {
          dispatch(removeOrder(order.orderId));
        }, 10000); // Removes the order after 15 seconds
      }
    });
  }, [store?.order.order, dispatch]);

  return store?.auth.success ? (
    <div className="sm:max-w-[400px]  w-full flex flex-col items-start justify-center gap-2.5">
      {initialData?.map((order) => (
        <div
          key={order?.orderId}
          className="w-full  text-[var(--dark-text)] flex items-start gap-3 justify-start"
        >
          <div
            onClick={() => {
              setOpen(!open);
              setOrderId(order.orderId);
            }}
            className="w-full   cursor-pointer h-full flex flex-col items-start justify-start gap-2"
          >
            <div className="w-full flex items-start gap-1.5">
              {orderStatus?.map((_, index) => (
                <p
                  key={index}
                  className={`w-20 h-1 ${
                    order.status === "cancelled"
                      ? "bg-red-500"
                      : index <=
                        statusSteps[order?.status as keyof typeof statusSteps] // Full green
                      ? "bg-[#2dd12d]"
                      : index ===
                        statusSteps[order?.status as keyof typeof statusSteps] +
                          1 // Partial green
                      ? "bg-green-200"
                      : "bg-gray-400" // Default gray
                  } `}
                />
              ))}
            </div>
            <div className="w-full flex  justify-between text-[var(--dark-text)] ">
              <div className="flex flex-col items-start gap-1">
                <h1 className=" text-xs flex  py-0.5 items-center justify-start gap-1 ">
                  <p className="text-[14px] text-[var(--dark-text)] ">
                    Current Order :{" "}
                  </p>{" "}
                  <p className=" text-[var(--dark-secondary-text)] flex items-start gap-1 text-[10px]">
                    {" "}
                    <span>order Id:</span> <span>{order?.orderId}</span>
                  </p>
                </h1>
                <p
                  className={`flex flex-col items-start  duration-150 justify-center gap-1 ${
                    order.orderId == orderId && open
                      ? "visible opacity-100 "
                      : " h-[0px] invisible opacity-0 "
                  } `}
                >
                  <span className="text-[var(--dark-secondary-text)] text-[10px] tracking-wide ">
                    {order?.products?.map(
                      (product) => ` ${product.name} × ${product.quantity} , `
                    )}
                  </span>
                  <span className="text-[10px] tracking-wide ">
                    Rs.{" "}
                    {order?.products?.reduce(
                      (productAcc, product) =>
                        productAcc + product.quantity * product.price,
                      0
                    )}{" "}
                    /-
                  </span>
                </p>
              </div>
            </div>
          </div>
          <button
            className={` ${
              orderId === order.orderId && open ? "rotate-180" : ""
            } duration-150 `}
            onClick={() => {
              setOrderId(order.orderId);
              setOpen(!open);
            }}
          >
            <ChevronDown className="size-6 " />
          </button>
        </div>
      ))}
    </div>
  ) : (
    ""
  );
};
