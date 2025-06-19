import { toast } from "react-hot-toast";
import { useState } from "react";
import { Icons } from "@/utils";
import Bell from "@/assets/order.mp3";
import { 
  User, 
  Package, 
  Clock, 
  Eye, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2,
  Check,
  X,
  CreditCard
} from "lucide-react";
import dayjs from "dayjs";

interface Order {
  orderId: string;
  products: Ui.Product[];
  orderRequest?: string;
  name?: string;
  note?: string;
  totalAmount?: number;
  paymentMethod?: "cash" | "online";
}

interface ToastActions {
  onAccept?: (orderId: string) => Promise<void>;
  onReject?: (orderId: string) => Promise<void>;
  onView?: (orderId: string) => void;
}

// Enhanced custom toast notification for new orders
export const customToast = (order: Ui.Order, actions?: ToastActions) => {
  const { orderId, products, orderRequest, name, note, paymentMethod } = order;

  // Calculate total amount
  const totalAmount = products?.reduce(
    (productAcc, product) =>
      productAcc + Number(product.price) * Number(product.quantity),
    0
  );

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio(Bell);
      audio.volume = 0.3;
      audio.play().catch(() => {
        console.log("Could not play notification sound");
      });
    } catch (error) {
      console.log("Notification sound not available");
    }
  };

  // Play sound when toast appears
  playNotificationSound();

  toast.custom(
    (t) => (
      <EnhancedToastContent 
        toast={t} 
        order={{ ...order, totalAmount }} 
        actions={actions} 
        onDismiss={() => toast.dismiss(t.id)} 
      />
    ),
    {
      position: "top-right",
      duration: 30000, // 30 seconds
      id: `order-${orderId}`, // Prevent duplicate toasts
    }
  );
};

interface EnhancedToastContentProps {
  toast: any;
  order: Order;
  actions?: ToastActions;
  onDismiss: () => void;
}

function EnhancedToastContent({ toast: t, order, actions, onDismiss }: EnhancedToastContentProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionTaken, setActionTaken] = useState<"accepted" | "rejected" | null>(null);

  const { orderId, products, orderRequest, name, note, totalAmount, paymentMethod } = order;

  const handleAccept = async () => {
    if (!actions?.onAccept) return;

    setIsAccepting(true);
    try {
      await actions.onAccept(orderId);
      setActionTaken("accepted");
      setTimeout(onDismiss, 2000); // Auto dismiss after 2 seconds
    } catch (error) {
      console.error("Failed to accept order:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!actions?.onReject) return;

    setIsRejecting(true);
    try {
      await actions.onReject(orderId);
      setActionTaken("rejected");
      setTimeout(onDismiss, 2000); // Auto dismiss after 2 seconds
    } catch (error) {
      console.error("Failed to reject order:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleView = () => {
    if (actions?.onView) {
      actions.onView(orderId);
    }
    onDismiss();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`
        ${t.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
        max-w-sm w-full shadow-2xl border-l-4 border-l-[var(--primary-color)] bg-[var(--light-foreground)]
        transition-all duration-300 ease-in-out hover:shadow-xl
        ${actionTaken === "accepted" ? "border-l-[var(--green-text)] bg-green-50 dark:bg-green-950" : ""}
        ${actionTaken === "rejected" ? "border-l-[var(--danger-text)] bg-red-50 dark:bg-red-950" : ""}
        rounded-lg border border-[var(--dark-border)]
      `}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--primary-color)]/10 rounded-full">
              <Icons.bell className="h-4 w-4 text-[var(--primary-color)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--dark-text)] text-sm">New Order Received</h3>
              <p className="text-xs text-[var(--dark-secondary-text)] flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Just now
              </p>
            </div>
          </div>

          {actionTaken && (
            <div className="flex items-center gap-1">
              {actionTaken === "accepted" ? (
                <CheckCircle2 className="h-5 w-5 text-[var(--green-text)]" />
              ) : (
                <AlertCircle className="h-5 w-5 text-[var(--danger-text)]" />
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--dark-border)]"></div>

        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[var(--dark-secondary-text)]" />
            <span className="font-medium text-[var(--dark-text)]">{name}</span>
            <span className="text-xs bg-[var(--light-background)] text-[var(--dark-text)] px-2 py-1 rounded border border-[var(--dark-border)]">
              #{orderId.slice(-6)}
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[var(--dark-secondary-text)]" />
            <span className="text-sm font-medium text-[var(--dark-text)]">Items ({products.length})</span>
          </div>

          <div className="ml-6 space-y-1 max-h-20 overflow-y-auto">
            {products.map((product, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-[var(--dark-secondary-text)]">
                  {product.name} × {product.quantity}
                </span>
                {product.price && (
                  <span className="font-medium text-[var(--dark-text)]">
                    {formatCurrency(Number(product.price) * Number(product.quantity))}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount */}
        {totalAmount && (
          <div className="flex justify-between items-center p-2 bg-[var(--light-background)] rounded">
            <span className="text-sm font-medium text-[var(--dark-text)]">Total</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--dark-text)]">{formatCurrency(totalAmount)}</span>
              {paymentMethod && (
                <span className={`text-xs px-2 py-1 border border-[var(--dark-border)]  rounded ${
                  paymentMethod === "online" 
                    ? "bg-[var(--primary-color)] text-[var(--dark-text)] " 
                    : "bg-[var(--green-text)] text-[var(--dark-text)]"
                }`}>
                  {paymentMethod === "online"  ? <span className="flex items-center gap-1"> <CreditCard className="size-4"/> Online</span> : "💵 Cash"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {(orderRequest || note) && (
          <div className="space-y-1">

            {note && (
              <div className="flex items-start gap-2">
                <MessageSquare className="h-3 w-3 text-[var(--dark-secondary-text)] mt-0.5" />
                <p className="text-xs text-[var(--dark-secondary-text)] italic">
              { note ?note :                 <p className="text-xs text-[var(--dark-secondary-text)]">
                  <span className="font-medium">Request:</span> {(() => {
                    const now = dayjs();
                    const requestTime = dayjs(orderRequest);
                    const diffMinutes = now.diff(requestTime, 'minute');
                    
                    if (diffMinutes === 0) {
                      return "now";
                    } else if (diffMinutes < 5) {
                      return `${diffMinutes} mins ago`;
                    } else {
                      return requestTime.format("DD/MM/YYYY hh:mm A");
                    }
                  })()}
                </p>}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-[var(--dark-border)]"></div>

        {/* Action Buttons */}
        {!actionTaken ? (
          <div className="flex gap-2">
            {actions?.onAccept && (
              <button
                onClick={handleAccept}
                disabled={isAccepting || isRejecting}
                className="flex-1 bg-[var(--green-text)] hover:bg-[var(--green-text)]/90 disabled:opacity-50 text-white text-xs font-medium px-3 py-2 rounded transition-colors"
              >
                {isAccepting ? (
                  <div className="flex items-center gap-1 justify-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Accepting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 justify-center">
                    <Check className="h-3 w-3" />
                    <span>Accept</span>
                  </div>
                )}
              </button>
            )}

            {actions?.onView && (
              <button 
                onClick={handleView} 
                className="flex-1 border border-[var(--dark-border)] text-[var(--dark-text)] hover:bg-[var(--light-background)] text-xs font-medium px-3 py-2 rounded transition-colors"
              >
                <div className="flex items-center gap-1 justify-center">
                  <Eye className="h-3 w-3" />
                  <span>View</span>
                </div>
              </button>
            )}

            {actions?.onReject && (
              <button
                onClick={handleReject}
                disabled={isAccepting || isRejecting}
                className="flex-1 border border-[var(--dark-border)] text-[var(--danger-text)] hover:bg-[var(--danger-text)]/5 disabled:opacity-50 text-xs font-medium px-3 py-2 rounded transition-colors"
              >
                {isRejecting ? (
                  <div className="flex items-center gap-1 justify-center">
                    <div className="w-3 h-3 border-2 border-[var(--danger-text)] border-t-transparent rounded-full animate-spin" />
                    <span>Rejecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 justify-center">
                    <X className="h-3 w-3" />
                    <span>Reject</span>
                  </div>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className={`text-sm font-medium ${actionTaken === "accepted" ? "text-[var(--green-text)]" : "text-[var(--danger-text)]"}`}>
              Order {actionTaken === "accepted" ? "Accepted" : "Rejected"} ✓
            </p>
          </div>
        )}

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="w-full text-xs text-[var(--dark-secondary-text)] hover:text-[var(--dark-text)] py-1 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
