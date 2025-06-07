import { Toast, toast } from "react-hot-toast";
import type React from "react"
import { Clock, CheckCircle, XCircle, Package } from "lucide-react"
import { useState } from "react";






interface CustomToastProps {
  order: Model.Order
  t: Toast
}

const CustomToast: React.FC<CustomToastProps> = ({ order, t }: CustomToastProps) => {
  const [startX, setStartX] = useState<number | null>(null)
  const [currentX, setCurrentX] = useState<number | null>(null)
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [isDismissing, setIsDismissing] = useState<boolean>(false)

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setStartX(event.touches[0].clientX)
    setIsSwapping(false)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startX !== null) {
      setCurrentX(event.touches[0].clientX)
      setIsSwapping(true)
    }
  }

  const handleTouchEnd = () => {
    if (startX !== null && currentX !== null) {
      const deltaX = currentX - startX
      if (Math.abs(deltaX) > 100) {
        setIsDismissing(true)
        setTimeout(() => {
          toast.dismiss(t.id)
        }, 200)
      } else {
        setCurrentX(null)
        setStartX(null)
        setIsSwapping(false)
      }
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        message: "Your order is currently pending. Please stay tuned for updates!",
      },
      preparing: {
        icon: Package,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        message: "Your order is being prepared. It won't be long until it's ready to enjoy.",
      },
      prepared: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        message: "Your order is prepared. Thank you for waiting patiently. Please visit us to receive your order.",
      },
      completed: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        message: "Your order has been completed. Thank you for ordering. Enjoy your meal!",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        message: "Your order has been cancelled. Please visit us to support us.",
      },
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }
  }

  const displayDate =
    order.status === "completed" && order.orderFullfilled
      ? formatDate(order.orderFullfilled)
      : formatDate(order.orderRequest)

  const translateX = currentX && startX ? currentX - startX : 0
  const opacity = Math.max(0.3, 1 - Math.abs(translateX) / 200)

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity: isDismissing ? 0 : opacity,
        transition: isSwapping ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={
        "w-[380px] max-w-[90vw] flex flex-col bg-white shadow-lg rounded-xl border transition-all duration-300" +
        statusConfig.borderColor +
        " " +
        (t.visible ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-2")
      }
    >
      {/* Status indicator bar */}
      <div className={`h-1 rounded-t-xl ${statusConfig.bgColor}`} />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 text-sm">
                Order {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </h3>
              <p className="text-xs text-gray-500 font-mono">ID: {order.orderId}</p>
            </div>
          </div>

          <div className="text-right text-xs text-gray-500">
            <p className="font-medium">{displayDate.date}</p>
            <p>{displayDate.time}</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-700 leading-relaxed">{statusConfig.message}</p>

        {/* Progress indicator for active orders */}
        {(order.status === "pending" || order.status === "preparing") && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{order.status === "pending" ? "25%" : "75%"}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ${statusConfig.color.replace("text-", "bg-")}`}
                style={{
                  width: order.status === "pending" ? "25%" : "75%",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Swipe indicator */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-center">
          <div className="w-8 h-1 bg-gray-300 rounded-full" />
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">Swipe to dismiss</p>
      </div>
    </div>
  )
}




export const showToast = (order: Model.Order) => {
  toast.custom((t) => <CustomToast t={t} order={order} />, { duration: 10000, position: "top-right" });
};
