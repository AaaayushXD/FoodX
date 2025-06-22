import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../../../services/order";
import { addNotification } from "../../../services/notification";
import Avatar from "../../../assets/logo/avatar.png";
import { UpdateStatus } from "@/features";
import { toaster } from "@/utils";
import { ApiError, getUserByUid } from "@/helpers";
import { Image } from "@/utils/Image";
import { Modal } from "@/common/popUp/Popup";
import { 
  User, 
  Package, 
  CreditCard, 
  Eye, 
  ChevronDown, 
  CalendarDays 
} from "lucide-react";

// interface OrderCardProps {
//   orderId: string;
//   items: [name: string, quantity: number];
//   price: number;
//   status: string;
//   date: Date;
// }

export const OrderCard: React.FC<Prop.RecentOrderProp> = ({
  orderId,
  note,
  image,
  products,
  price,
  status,
  orderRequest,
  uid,
  paymentMethod,
  paymentImage,
  name,
}) => {
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [isNewStatus, setIsNewStatus] = useState<Common.OrderStatus>(status);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  useEffect(()=>{
    setIsNewStatus(status);
  },[status])
  
  const ogDate = dayjs(orderRequest).format("h:mm:ss A");
  const date = dayjs(orderRequest).format("MMM D, h:mm A");

  const message = {
    completed: "Your order has been successfully completed.",
    cancelled:
      "Your order has been cancelled. Please contact customer support for assistance.",
  };

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "bg-[var(--pending)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
    preparing: {
      label: "Preparing", 
      color: "bg-[var(--preparing)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
    prepared: {
      label: "Prepared",
      color: "bg-[var(--prepared)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
    completed: {
      label: "Completed",
      color: "bg-[var(--completed)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-[var(--cancelled)] text-[var(--dark-text)] border-[var(--dark-border)]",
    },
  };

  // Function to get available statuses based on current status
  const getAvailableStatuses = (currentStatus: Common.OrderStatus) => {
    const statusFlow = {
      pending: ["preparing", "cancelled","completed","prepared"],
      preparing: ["prepared", "cancelled","completed"],
      prepared: ["completed", "cancelled"],
      completed: [], // No further status changes allowed
      cancelled: [], // No further status changes allowed
    };

    return statusFlow[currentStatus] || [];
  };

  const formatProducts = () => {
    return products?.map(
      (product) => `${product.name} × ${product?.quantity}`
    ).join(", ");
  };

  const formatPrice = (price: number) => {
    return `Rs ${price}`;
  };

  const handleStatusChange = async (newStatus: Common.OrderStatus) => {
    if (!newStatus && !id) return toast.error("Order doesn't exist");
    const toastLoader = toaster({
      icon: "loading",
      message: "Please wait...",
    });
    const user = await getUserByUid(uid as string);
    try {
      const response = await updateOrderStatus({
        id: id as string,
        status: newStatus!,
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
      setIsNewStatus(newStatus!);
      setIsStatusOpen(false);
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

  return (
    <>
      <div className="w-full min-w-[500px] hover:shadow-md transition-all duration-200 border border-[var(--dark-border)] rounded-lg bg-[var(--light-foreground)]">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            {/* Left Section - Customer & Order Details */}
            <div className="flex items-start gap-3 flex-1">
              {/* Avatar */}
              {/* <div className="h-12 w-12 border-2 border-[var(--dark-border)]/20 rounded-full overflow-hidden bg-[var(--light-background)] flex items-center justify-center">
                {image ? (
                  <Image
                    highResSrc={import.meta.env.VITE_API_URL_ASSETS + image as string}
                    lowResSrc={Avatar}
                    className="h-full w-full object-cover"
                    alt={name || "Customer"}
                  />
                ) : (
                  <User className="h-5 w-5 text-[var(--dark-secondary-text)]" />
                )}
              </div> */}

              {/* Order Details */}
              <div className="flex-1 space-y-2">
                {/* Customer Name */}
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[var(--dark-text)] text-sm">{name || "Customer"}</h3>
                  <span className="text-xs px-2 py-0.5 rounded border border-[var(--dark-border)] text-[var(--dark-secondary-text)]">
                    #{orderId.slice(-6)}
                  </span>
                </div>

                {/* Products */}
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-[var(--dark-secondary-text)] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[var(--dark-secondary-text)] leading-relaxed">{formatProducts()}</p>
                </div>

                {/* Note/Pre-order time */}
                {note && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-[var(--dark-secondary-text)] bg-[var(--light-background)] px-2 py-1 rounded">
                       {note}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[var(--dark-text)]">{formatPrice(price)}</span>
                  {paymentMethod === "online" && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--light-background)] text-[var(--dark-secondary-text)] border border-[var(--dark-border)]">
                      <CreditCard className="h-3 w-3 mr-1 inline" />
                      Online
                    </span>
                  )}
                </div>

                {/* Payment Image Preview */}
                {paymentMethod === "online" && paymentImage && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="h-8 text-xs px-3 py-1 rounded border border-[var(--dark-border)] text-[var(--dark-text)] hover:bg-[var(--light-background)] transition-colors flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View Payment
                    </button>
                    <div
                      className="h-8 w-8 rounded border border-[var(--dark-border)] overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      <img
                        src={import.meta.env.VITE_API_URL_ASSETS + paymentImage}
                        alt="Payment preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Status & Date */}
            <div className="flex flex-col items-end gap-3 min-w-[120px]">
              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsStatusOpen(!isStatusOpen);
                    setId(orderId);
                  }}
                  className={`w-full justify-between text-xs font-medium px-3 py-2 rounded border transition-colors flex items-center gap-1 border-[var(--dark-border)] text-[var(--dark-text)]`}
                >
                  {statusConfig[isNewStatus || status].label}
                  <ChevronDown className="h-3 w-3" />
                </button>
                
                {/* Status Dropdown Menu */}
                {isStatusOpen && id === orderId && (
                  <div className="absolute text-[var(--dark-text)] top-full right-0 mt-1 w-32 bg-[var(--light-foreground)] border border-[var(--dark-border)] rounded-md shadow-lg z-50">
                    {getAvailableStatuses(isNewStatus || status).map((statusKey) => (
                      <button
                        key={statusKey}
                        onClick={() => handleStatusChange(statusKey as Common.OrderStatus)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--light-background)] flex items-center gap-2"
                      >
                        <div className={`w-2 h-2 text-[va(--dark-text)] rounded-full ${statusConfig[statusKey as keyof typeof statusConfig].color.split(" ")[0]}`} />
                        {statusConfig[statusKey as keyof typeof statusConfig].label }
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center gap-1 text-xs text-[var(--dark-secondary-text)]">
                <CalendarDays className="h-3 w-3" />
                <span>{date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Image Modal */}
      {showPaymentModal && (
        <Modal close={false} closeModal={() => setShowPaymentModal(false)}>
          <div className="max-w-4xl max-h-[90vh] p-0">
            <div className="p-6 pb-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--dark-text)]">
                <CreditCard className="h-5 w-5" />
                Payment Confirmation
              </h2>
            </div>
            <div className="border-t border-[var(--dark-border)]" />
            <div className="p-6 pt-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative max-w-full h-[60vh] overflow-hidden rounded-lg border border-[var(--dark-border)]">
                  <img
                    src={import.meta.env.VITE_API_URL_ASSETS + paymentImage}
                    alt="Payment confirmation"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 rounded border border-[var(--dark-border)] text-[var(--dark-text)] hover:bg-[var(--light-background)] transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => window.open(import.meta.env.VITE_API_URL_ASSETS + paymentImage, "_blank")}
                    className="px-4 py-2 rounded bg-[var(--primary-color)] text-white hover:bg-[var(--primary-light)] transition-colors"
                  >
                    Open Full Size
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};



