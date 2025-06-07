import { ChefHat, Clock, ChevronDown, Package, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { removeOrder, addOrder } from "@/reducer";
import {
  useHooks,
  useAppDispatch,
  useAppSelector,
  useGetRecentOrder,
} from "@/hooks";



const statusSteps = {
  pending: 0,
  preparing: 1,
  prepared: 2,
  completed: 3,
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 0,
  }).format(amount)
}


const statusLabels = [
  { label: "Pending", icon: Clock },
  { label: "Preparing", icon: Package },
  { label: "Prepared", icon: ChefHat },
  { label: "Completed", icon: CheckCircle },
]

const statusColors = {
  pending: "bg-amber-500",
  preparing: "bg-blue-500",
  prepared: "bg-purple-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
}



const getStatusProgress = (status: Model.Order["status"]) => {
  if (status === "cancelled") return -1
  return statusSteps[status]

}



const getOrderTotal = (products: Model.Product[]) => {
  return products.reduce((total, product) => total + product.quantity * product.price, 0)
}

export const OrderNotification = () => {
  const {
    orderId,
    setOrderId,
    open,
    setOpen,
    data: initialData,
    setData,
  } = useHooks<Model.Order[], "orderNotification">("orderNotification");


  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)


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

  useEffect(() => {
    if (data.length && !loading) {
      data?.forEach((order) => {
        if (order.status !== "completed") {
          dispatch(
            addOrder({
              orderId: order.id,
              products: order.products,
              status: order.status,
              orderRequest: order.time, // orderRequest
              uid: order.uid,
            })
          );
        }
      });
    }
  }, [loading]);

  useEffect(() => {
    setData(store?.order?.order);
  }, [store.order.order]);

  const orderStatus: Model.OrderStatus[] = [
    "pending",
    "prepared",
    "prepared",
    "completed",
  ];



  useEffect(() => {
    store?.order?.order?.forEach((order) => {
      if (order.status === "completed" || order.status === "cancelled") {
        setTimeout(() => {
          dispatch(removeOrder(order.orderId));
        }, 10000); // Removes the order after 15 seconds
      }
    });
  }, [store?.order.order, dispatch]);


  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return store?.auth.success ? (
    <div className="w-full  space-y-4">
      {initialData?.map((order) => {
        const isExpanded = expandedOrder === order.orderId
        const currentStep = getStatusProgress(order.status)
        const isCancelled = order.status === "cancelled"


        return (
          <div
            key={order.orderId}
            className={`  w-full rounded-xl bg-white border-gray-200 shadow-sm transition-all duration-300  ${isExpanded ? " border-gray-300" : ""
              }`}
          >
            {/* Header */}
            <div className="p-6 cursor-pointer" onClick={() => toggleOrder(order?.orderId as string)}>
              {/* Order Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isCancelled ? "bg-red-500" : statusColors[order.status]}`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-500 capitalize">Status: {order.status}</p>
                  </div>
                </div>
                <button
                  className={`p-2 rounded-full hover:bg-gray-100 transition-all duration-200 ${isExpanded ? "rotate-180" : ""
                    }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleOrder(order?.orderId as string)
                  }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                {/* Status Steps */}
                <div className="flex items-center justify-between">
                  {statusLabels.map((step, index) => {
                    const Icon = step.icon
                    let stepStatus = "upcoming"

                    if (isCancelled) {
                      stepStatus = "cancelled"
                    } else if (index <= currentStep) {
                      stepStatus = "completed"
                    } else if (index === currentStep + 1) {
                      stepStatus = "current"
                    }

                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${stepStatus === "completed"
                            ? "bg-green-500 text-white"
                            : stepStatus === "current"
                              ? "bg-blue-500 text-white animate-pulse"
                              : stepStatus === "upcoming"
                                ? "bg-gray-200 text-gray-400"
                                : stepStatus === "cancelled"
                                  ? "bg-red-500 text-white"
                                  : ""
                            }`}
                        >
                          {stepStatus === "cancelled" ? <XCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <span
                          className={`text-xs mt-1 font-medium transition-colors duration-300 ${stepStatus === "completed"
                            ? "text-green-600"
                            : stepStatus === "current"
                              ? "text-blue-600"
                              : stepStatus === "upcoming"
                                ? "text-gray-400"
                                : stepStatus === "cancelled"
                                  ? "text-red-600"
                                  : ""
                            }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Progress Line */}
                <div className="relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
                  <div
                    className={`absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transition-all duration-500 ${isCancelled ? "bg-red-500" : "bg-green-500"
                      }`}
                    style={{
                      width: isCancelled ? "0%" : `${Math.max(0, (currentStep / (statusLabels.length - 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Expandable Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-4 space-y-4">
                  {/* Products */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                            <span className="text-sm text-gray-500 ml-2">× {product.quantity}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(product.price * product.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(getOrderTotal(order.products))}
                    </span>
                  </div>

                  {/* Additional Info */}
                  {(order.orderRequest || order.orderFullfilled) && (
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      {order.orderRequest && (
                        <div>
                          <span className="text-xs text-gray-500 block">Order Date</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(order.orderRequest).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {order.orderFullfilled && order.status !== "completed" && order.status !== "cancelled" && (
                        <div>
                          <span className="text-xs text-gray-500 block">Estimated Delivery</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(order.orderFullfilled).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    ""
  );
};
