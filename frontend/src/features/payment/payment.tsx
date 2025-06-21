import React, { useState } from "react";
import dayjs from "dayjs";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { TimePicker } from "@/features";
import { addOrder, resetCart } from "@/reducer";
import { addOrder as orderAdd, resendOtp, userUpload } from "@/services";
import { addRevenue, addNotification, removeProductFromCart } from "@/services";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";
import { RippleButton } from "@/common";
import { VerificationContainer } from "@/pages";
import { Modal } from "@/common";
import { FaUpload, FaTimes } from 'react-icons/fa';
import { QrCode, QrCodeIcon } from "lucide-react";
import qrImageAsset from "@/assets/qr.png";

export const Payment: React.FC = () => {
  const [paymentMethod, setPayementMethod] = useState<Model.PaymentMethod>();
  const [preOrder, setPreOrder] = useState<boolean>(false);
  const [preOrderTime, setPreOrderTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [qrImage, setQrImage] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>("");
  const [showQrModal, setShowQrModal] = useState(false);

  const navigate = useNavigate();
  const { auth, cart } = useAppSelector();
  const [isUserVeried, setIsUserVerified] = useState<boolean>(true);

  const handlePaymentSelection = (paymentMethod: Model.PaymentMethod) => {
    setPayementMethod(paymentMethod);
  };

  const store = useAppSelector();
  const dispatch = useAppDispatch();

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrImage(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const removeQr = () => {
    setQrImage(null);
    setQrPreview("");
  };

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
    if (paymentMethod === "online" && !qrImage) {
      toaster({
        icon: "warning",
        className: "bg-yellow-100",
        title: "QR Image Required",
        message: "Please upload your payment QR image.",
      });
      return;
    }
    if (cart?.products?.length <= 0) {
      return toaster({
        icon: "warning",
        className: "bg-orange-100",
        title: "No products in cart",
        message: "You have to add products to cart to order",
      });
    }
    if (preOrder && !preOrderTime) {
      return toaster({
        icon: "warning",
        className: "bg-yellow-100",
        title: "Preorder Time Required",
        message: "Please select a preorder time.",
      });
    }
    try {
      if (!auth?.userInfo?.isVerified) {
        await resendOtp({
          email: auth?.userInfo?.email as string || localStorage?.getItem("email") as string,
          type: "reset",
          uid: auth?.userInfo?.uid as string || localStorage?.getItem("uid") as string
        });
        toaster({
          className: "bg-yellow-50",
          icon: "warning",
          title: "Account Verification Required",
          message:
            "To proceed with your order, please verify your account. Check your email for the verification link.",
        });

        localStorage?.setItem("verifyType", "otp");
        return setIsUserVerified(false);
      }
      setLoading(true);
      let image = "";
      if (paymentMethod === "online") {
        const uploadImage = await userUpload(qrImage as File, "orders");
        image = `${uploadImage?.data?.folderName}/${uploadImage?.data?.filename}`;
      }
      // Prepare payload for API (not Redux)
      const orderPayload : Model.Order = {
        role: auth?.userInfo?.role,
        uid: auth?.userInfo?.uid as string,
        products: cart?.products,
        orderRequest: dayjs().toISOString(),
        status: "pending" as Model.OrderStatus,
        note: preOrder && preOrderTime ? `Preorder Time: ${preOrderTime}` : "",
        image: image,
        paymentMethod: paymentMethod
      };
      const response = await orderAdd(orderPayload);
      dispatch(addOrder({
        orderId: response?.data,
        products: cart?.products,
        status: "pending",
        orderRequest: dayjs().toISOString(),
        uid: auth?.userInfo?.uid as string,
        note: preOrder && preOrderTime ? `Preorder Time: ${preOrderTime}` : "",
        role: auth?.userInfo?.role,
      }));
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
          icon: "error",
          className: "bg-red-50",
          message: error?.message,
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
      
      {/* QR Payment Modal Trigger */}
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 transition-all text-sm"
        >
          <QrCode className="w-5 h-5" />
          Show QR for Payment
        </button>
      </div>
      {/* QR Modal */}
      <Modal close={!showQrModal} closeModal={() => setShowQrModal(false)}>
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg max-w-xs w-full">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Scan & Pay</h2>
          <img
            src={qrImageAsset}
            alt="Payment QR"
            className="w-full h-[300px]  object-top object-cover rounded border border-gray-200 shadow mb-4"
          />
          <a
            href={qrImageAsset}
            download="payment-qr.jpeg"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium shadow hover:bg-green-700 transition-all"
          >
            <FaUpload /> Download QR
          </a>
          <p className="text-xs text-gray-500 mt-3 text-center">Use any e-wallet or banking app to scan and pay. Save this QR for future payments.</p>
        </div>
      </Modal>

      <div className="flex flex-col gap-4">
        {/* Payment Method */}
        <div className="flex flex-col">
          <label className="text-[var(--dark-secondary-text)]">
            Select Payment Method
          </label>
          <div className="flex gap-3 mt-2">
            <RippleButton
              onClick={() => handlePaymentSelection("online")}
              className={`w-full py-3 bg-green-500 font-semibold tracking-wide rounded-lg text-white ${paymentMethod === "online"
                  ? "ring-[4px] ring-[var(--dark-border)]  "
                  : ""
                }`}
            >
              Online
            </RippleButton>
            <RippleButton
              onClick={() => handlePaymentSelection("cash")}
              className={`w-full py-3   font-semibold bg-orange-500  tracking-wide rounded-lg text-white ${paymentMethod === "cash"
                  ? "ring-[4px] ring-[var(--dark-border)]  "
                  : ""
                }`}
            >
              Cash
            </RippleButton>
          </div>
        </div>

        {/* Preorder Section */}
        <div className="flex flex-col w-full mt-4">
          <label className="text-[var(--dark-secondary-text)] mb-2 flex justify-between items-center gap-2">
            <span>Do you want to Pre-order?</span>
            <span className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="preorder"
                id="preorder-toggle"
                checked={preOrder}
                onChange={() => setPreOrder((prev) => !prev)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200"
                style={{ left: preOrder ? '1.5rem' : '0' }}
              />
              <label
                htmlFor="preorder-toggle"
                className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 ${preOrder ? "bg-green-500" : "bg-gray-300"} cursor-pointer`}
              ></label>
            </span>
          </label>
          {preOrder && (
            <div className="flex items-center gap-3 mt-3">
              {/* <span className="text-[var(--dark-secondary-text)]">Select Time:</span> */}
              <TimePicker
                action={(time) => setPreOrderTime(dayjs(time).format("h:mm:ss A"))}
              />
              {preOrderTime && (
                <span className="ml-2 text-green-600 font-semibold">{preOrderTime}</span>
              )}
            </div>
          )}
        </div>

        {/* QR Upload for Online Payment */}
        {paymentMethod === "online" && (
          <div className="flex flex-col items-center w-full mt-4">
            <label className="text-[var(--dark-secondary-text)] mb-2 font-medium">Upload Payment QR Image</label>
            <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--dark-border)] rounded-lg p-4 bg-[var(--light-background)] hover:bg-[var(--light-foreground)] transition-all cursor-pointer relative group">
              {qrPreview ? (
                <div className="relative w-32 h-32 flex flex-col items-center justify-center">
                  <img src={qrPreview} alt="QR Preview" className="object-contain w-full h-full rounded-lg shadow" />
                  <button type="button" onClick={removeQr} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-all">
                    <FaTimes size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <QrCodeIcon className="text-[var(--primary-color)] size-4 mb-2"  />
                  <span className="text-[var(--dark-secondary-text)] text-sm mb-2">Drag & drop or click to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>
        )}

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
      {!isUserVeried && (
        <Modal
          children={<VerificationContainer closeModal={() => setIsUserVerified(!isUserVeried)} />}
          close={isUserVeried}
          closeModal={() => setIsUserVerified(!isUserVeried)}
        />
      )}
    </div>
  );
};

//recent products
