import React, { useRef, useState } from "react";
import { Icons, toaster } from "@/utils";
import { Invoice } from "@/components";
import { useAppDispatch, useAppSelector } from "@/hooks";
import dayjs from "dayjs";
import { pdf } from "@react-pdf/renderer";
import { addProductToCart, getOrder, removeProductFromCart } from "@/services";
import { addToCart, removeCart } from "@/reducer";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

export const SingleOrder = () => {
  const orderIdReference = useRef<HTMLSpanElement | null>(null);
  const { orderId } = useParams();
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const route = useNavigate();

  const { data, isError, isLoading, error } = useQuery(
    ["single-order", orderId],
    {
      queryFn: async () => getOrder(orderId),
      cacheTime: 5 * 60 * 60,
      staleTime: 5 * 60 * 60,
      refetchOnWindowFocus: false,
      enabled: !!orderId,
    }
  );

  const { auth, cart } = useAppSelector();
  const dispatch = useAppDispatch();

  const downloadPdf = async (selectedOrder: Model.Order) => {
    const loading = toaster({
      title: "Please wait...",
      icon: "loading",
    });
    try {
      const doc = (
        <Invoice
          orders={[
            {
              orderDetails: {
                products: selectedOrder?.products as Ui.Product[],
                status: selectedOrder?.status as Model.OrderStatus,
              },
              invoiceData: {
                invoiceDate: dayjs(selectedOrder?.orderFullfilled).format(
                  "	MMM D, YYYY h:mm A"
                ),
                invoiceNumber: selectedOrder!.orderId,
              },
              customerDetails: {
                name: auth?.userInfo?.fullName as string,
                phoneNumber: parseInt(auth?.userInfo?.phoneNumber as string),
                userId: auth?.userInfo?.uid as string,
              },
            },
          ]}
        ></Invoice>
      );
      const asBlob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(asBlob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toaster({
        title: "Download failed",
        message:
          "We can't donwload this order due to unexpected Error. Please try again",
        icon: "error",
      });
    } finally {
      toast.dismiss(loading);
    }
  };

  async function orderAgain() {
    cart?.products?.forEach(async (product: Ui.Product) => {
      await removeProductFromCart(auth?.userInfo?.uid as string, product.id);
      dispatch(removeCart(product.id));
    });

    data?.data?.products.forEach(async (product) => {
      await addProductToCart(auth?.userInfo?.uid as string, product.id);
      dispatch(addToCart({ ...product }));
    });
    route("/checkout");
  }

  const handleCopy = () => {
    if (orderIdReference.current) {
      navigator?.clipboard.writeText(orderIdReference.current.innerText);
      setIsCopy(true);
    }
  };
  const orderStatus: { icon: React.ReactNode; title: string; time: string }[] =
    [
      {
        title: "Order has been request",
        icon: <Icons.request className="size-2.5 text-white" />,
        time:
          dayjs(data?.data?.orderRequest).format("MMM D, YYYY h:mm A") || "N/A",
      },
      {
        title: "Order has been deliverd",
        icon: <Icons.check className="size-2.5 text-white" />,
        time:
          dayjs(data?.data?.orderFullfilled).format("MMM D, YYYY h:mm A") ||
          "N/A",
      },
    ];
  return (
    <div className="w-full bg-[var(--body-bg)]  h-full   flex flex-col items-start justify-start gap-5">
      {/* navigation */}
      <div className="w-full flex p-3 bg-white fixed top-0 left-0 right-0 items-center justify-between">
        <button onClick={() => route(-1)}>
          <Icons.arrowLeft />
        </button>
        <h1 className=" text-[16px] font-semibold sm:text-[14px] ">
          Order Details
        </h1>
        <a
          href="tel:+977-9848255044"
          className=" font-semibold flex items-center justify-start gap-1 text-red-600"
        >
          <Icons.call fill="red" className=" size-4 sm:size-5" />
          SUPPORT
        </a>
      </div>
      {/*  order id */}
      <div className="w-full flex mt-20 bg-white p-2 items-center justify-between  ">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className=" text-[14px] sm:text-[16px] ">Order ID</p>
          <span
            className="text-[16px] font-semibold sm:text-[18px] "
            ref={orderIdReference}
          >
            {data?.data?.orderId}
          </span>
        </div>

        <button onClick={handleCopy}>
          {isCopy ? (
            <Icons.clibBoardCheck className="size-5 sm:size-6  " />
          ) : (
            <Icons.copy className={`size-5 sm:size-6  `} />
          )}
        </button>
      </div>
      {/* order status */}
      <div className="w-full flex flex-col p-2 items-start justify-start gap-3 bg-white">
        <h1 className=" text-[18px] font-semibold ">Order Status</h1>
        <div className="w-full flex flex-col items-start gap-1">
          {orderStatus?.map((order, index) => (
            <OrderStatus
              icon={order.icon}
              time={order.time}
              title={order.title}
              key={index}
            />
          ))}
        </div>
      </div>
      {/* order info */}
      <div className="w-full p-2 flex flex-col items-start justify-start gap-2 bg-white">
        <h1 className=" text-[18px] font-semibold ">Order Info</h1>
        {data?.data?.products?.map((order) => (
          <ul className="w-full flex flex-col items-start justify-start gap-0">
            <li className=" text-[14px] sm:text-[16px] ">
              {order.name} ({order.quantity})
            </li>
            <li className=" text-[var(--secondary-text)] font-semibold  text-[12px] ">
              Rs.{order.price}{" "}
            </li>
          </ul>
        ))}
      </div>
      {/* payment type */}
      <div className="w-full p-4 bg-white flex items-center justify-between ">
        <div className="flex items-center justify-start gap-2">
          <Icons.bill className="size-6 bg-green-500 p-1 rounded-full text-white " />
          <h1 className=" text-[16px] font-semibold ">Pay via</h1>
        </div>
        <p className=" text-[16px] font-semibold ">Cash Payment</p>
      </div>
      <div className=" w-full  bg-white p-2 flex flex-col items-start justify-start gap-4">
        <div className=" w-full flex flex-col items-start justify-start gap-4">
          <h1 className=" text-[16px] ">RECIEPT</h1>
          <button className="flex items-center w-full bg-green-200  rounded-md p-2 justify-start gap-1">
            <Icons.alert className="size-8 text-white rounded-full p-2 bg-green-500 " />
            <p className="w-full text-start">
              You can now update the cart even after placing the order{" "}
              <span className="text-green-500">Lean more</span>
            </p>
          </button>
        </div>
        <div className="w-full flex gap-5 items-center justify-between ">
          <button
            onClick={() => downloadPdf(data?.data)}
            className="w-1/2 flex items-center justify-center py-2 rounded-lg text-[16px] font-semibold   border-[var(--dark-border)] border-[1px] "
          >
            DOWNLOAD
          </button>
          <button
            onClick={orderAgain}
            className="w-1/2 flex items-center justify-center py-2 rounded-lg text-[16px] font-semibold text-white bg-red-600 "
          >
            ORDER AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderStatus = ({
  title,
  time,
  icon,
}: {
  title: string;
  time: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className=" flex flex-col items-start justify-start gap-1">
      <div className="flex items-center justify-start gap-1">
        <button
          className=" bg-green-500 p-0.5
         rounded-full "
        >
          {icon}
        </button>
        <h1 className=" text-[14px] sm:text-[16px] font-semibold ">{title}</h1>
      </div>
      <p className="text-[12px] px-5 sm:text-[14px] text-[var(--secondary-text)] ">
        {time}
      </p>
    </div>
  );
};
