import { toast } from "react-hot-toast";

// Custom toast notification for new orders in the admin panel
export const customToast = (order: Ui.Order) => {
  const { orderId, products, orderRequest, name, note } = order;

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-pulse" : "animate-pulse"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-in-out`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            {/* Order details */}
            <div className="ml-1 flex-1">
              <p className="text-sm font-bold text-gray-900">
                New Order from {name}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Order ID: <span className="font-semibold">{orderId}</span>
              </p>

              {/* Ordered Products */}
              <div className="mt-1 text-sm text-gray-600">
                <p className="font-medium">Products Ordered:</p>
                <ul className="list-disc ml-4 space-y-1">
                  {products.map((product: Ui.Product, index: number) => (
                    <li key={index} className="text-sm">
                      {product.name} x {product.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Request */}
              {orderRequest && (
                <p className="mt-2 text-sm text-gray-500">
                  Request: {orderRequest}
                </p>
              )}

              {/* Additional Note */}
              {note && (
                <p className="mt-1 text-sm italic text-gray-400">
                  Note: {note}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col text-indigo-600 duration-150 border-gray-300 border-l rounded-r-lg hover:text-white hover:bg-indigo-600 justify-center">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full px-4 py-2 text-sm font-medium  focus:outline-none "
          >
            Dismiss
          </button>
        </div>
      </div>
    ),
    { position: "top-right", duration: Infinity }
  );
};
