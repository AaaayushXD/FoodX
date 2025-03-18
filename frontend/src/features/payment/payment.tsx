import React, { useState } from "react";
import dayjs from "dayjs";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { TimePicker } from "@/features";
import { addOrder, resetCart } from "@/reducer";
import { addOrder as orderAdd } from "@/services";
import { addRevenue, addNotification, removeProductFromCart } from "@/services";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";

export const Payment: React.FC = () => {
  const [paymentMethod, setPayementMethod] = useState<Model.PaymentMethod>();
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { auth, cart } = useAppSelector();

  const handlePaymentSelection = (paymentMethod: Model.PaymentMethod) => {
    setPayementMethod(paymentMethod);
  };

  const store = useAppSelector();
  const dispatch = useAppDispatch();

  const handlePayment = async () => {
    if (!paymentMethod) {
      toaster({
        icon: "warning",
        className: "bg-red-100",
        title: "Select payment method",
        message: "You have to select payment method to order",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await orderAdd({
        uid: auth?.userInfo?.uid,
        products: cart?.products,
        orderRequest: dayjs().toISOString(),
        status: "pending",
      });
      if (response?.message)
        toaster({
          title: response?.message,
          className: " bg-green-100",
          icon: "success",
          message: "Your order was successfully placed",
        });
      await addRevenue({
        id: dayjs().format("YYYY-MM-DD"),
        orders: store.cart.products,
      });
      await addNotification({
        uid: store.auth.userInfo.uid as string,
        title: "Order Confirmed!",
        message: `Order placed successfully! We're processing your ${store?.cart?.products?.length} item. Thank you for shopping with us!"`,
      });

      // socket.on("new_order", handleOrder);
      navigate("/order/success");
      store?.cart?.products.forEach(async (product) => {
        await removeProductFromCart(
          store?.auth?.userInfo?.uid as string,
          product.id
        );
      });
      dispatch(resetCart());
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: error?.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:max-w-md p-5 lg:mt-12 rounded-lg bg-[var(--light-foreground)]">
      <h1 className="text-xl font-semibold tracking-wider text-[var(--dark-text)] mb-5">
        Payment Information
      </h1>
      <div className="flex flex-col gap-4">
        {/* Payment Method */}
        <div className="flex flex-col">
          <label className="text-[var(--dark-secondary-text)]">
            Select Payment Method
          </label>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handlePaymentSelection("online")}
              className={`w-full py-3 bg-green-500 font-semibold tracking-wide rounded-lg text-white ${
                paymentMethod === "online"
                  ? "ring-[4px] ring-[var(--dark-border)]  "
                  : ""
              }`}
            >
              Online
            </button>
            <button
              onClick={() => handlePaymentSelection("cash")}
              className={`w-full py-3   font-semibold bg-orange-500  tracking-wide rounded-lg text-white ${
                paymentMethod === "cash"
                  ? "ring-[4px] ring-[var(--dark-border)]  "
                  : ""
              }`}
            >
              Cash
            </button>
          </div>
        </div>

        {/* Note Section */}
        <div className="flex relative flex-col w-full mt-4">
          <label className="text-[var(--dark-secondary-text)]">
            Add a Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 mt-2 outline-none text-[14px] rounded-lg bg-[var(--light-background)] border-[1px] border-[var(--dark-border)] text-[var(--dark-text)] placeholder:text-[var(--dark-secondary-text)]"
            placeholder="Special requests or instructions"
            rows={3}
          />
          <div className="w-full bottom-0 absolute flex justify-end mt-0.5  ">
            <TimePicker
              action={(time) =>
                setNote((prev) => {
                  if (prev?.includes("Arrival Time: ")) {
                    return prev.replace(
                      /(Arrival Time: ).*$/,
                      `$1${dayjs(time).format("h:mm:ss A")}`
                    );
                  }
                  return ` ${prev}  \n Arrival Time: ${dayjs(time).format(
                    "h:mm:ss A"
                  )} `;
                })
              }
            />
          </div>
        </div>

        {/* Payment Action */}
        <div className="flex items-center justify-between mt-5">
          <button
            type="button"
            onClick={handlePayment}
            className="bg-[var(--primary-color)] text-white text-sm sm:text-[15px]  tracking-wide flex gap-2 items-center justify-start text-[var(--dark-text)] py-2 px-4 rounded-lg hover:bg-[var(--primary-light)] transition-all"
          >
            Order Now
            {loading && <MoonLoader color="white" size={14} />}
          </button>
        </div>
      </div>

      <div className="mt-5 text-[var(--dark-secondary-text)] text-center">
        <small>All payments are processed securely through online.</small>
      </div>
    </div>
  );
};

//recent products
