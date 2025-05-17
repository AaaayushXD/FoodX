import React from "react";
import { Icons, toaster } from "@/utils";
import PlaceholderImg from "@/assets/placeholder.svg";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addProductToCart, removeProductFromCart } from "@/services";
import { addToCart, removeCart } from "@/reducer";
import { ApiError, Image } from "@/helpers";
import toast from "react-hot-toast";

export const OrderCard: React.FC<Model.UserOrder> = (order) => {
  const totalCost = order?.products?.reduce(
    (productAcc, product) => productAcc + product.price * product.quantity,
    0
  );
  const navigate = useNavigate();
  const route = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, auth } = useAppSelector();

  async function orderAgain() {
    const loading = toaster({
      title: "Please wait...",
      icon: "loading",
    });
    try {
      cart?.products?.forEach(async (product: Ui.Product) => {
        await removeProductFromCart(auth?.userInfo?.uid as string, product.id);
        dispatch(removeCart(product.id));
      });

      order?.products.forEach(async (product) => {
        await addProductToCart(auth?.userInfo?.uid as string, product.id);
        dispatch(addToCart({ ...product }));
      });
      route("/checkout");
      toaster({
        icon: "success",
        title: "Product Added",
        message: "Your order's products ordered again",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          message: error?.message,
          icon: "error",
          className: " bg-red-50 ",
        });
      }
    } finally {
      toast.dismiss(loading);
    }
  }

  return (
    <div className="w-full flex flex-col items-start justify-start gap-5 bg-white h-full p-3 ">
      <div className="w-full flex items-center justify-between">
        <p className="sm:text-[16px] font-semibold text-[14px]  ">
          {order.time}
        </p>
        <button
          onClick={() => navigate(`${order?.id}`)}
          className=" flex items-center justify-start gap-1 text-[14px] sm:text-[16px] font-semibold "
        >
          Rs.{totalCost}{" "}
          <Icons.chevronRight className=" size-3 sm:size-5 text-[var(--secondary-text)] " />
        </button>
      </div>
      <div className="w-full  flex items-center justify-between px-2 gap-4">
        <div className="flex flex-col items-start justify-start gap-2">
          {order?.products?.slice(0, 3).map((product, index) => (
            <li
              key={index}
              className="text-[13px] flex items-center justify-start gap-2 list-none  sm:text-[14px]  text-[var(--secondary-text)] "
            >
              <button>
                <Icons.cook className=" size-4" />
              </button>
              {product?.name}({product.quantity})
              {/* <span>{product?.description }</span> */}
            </li>
          ))}
        </div>
        {
          <div className="size-16 rounded-full">
            <Image
              lowResSrc={PlaceholderImg}
              className="size-full object-cover rounded-full"
              highResSrc={
                import.meta.env.VITE_URI +
                "assets/" +
                order?.products[0]?.image ||
                import.meta.env.VITE_URI +
                "assets/" +
                order?.products[1]?.image
              }
              alt={order?.products[0]?.name || order?.products[1]?.name}
            />
          </div>
        }
      </div>
      <div className="w-full flex items-center justify-between border-t-[1.3px] pt-2 border-dotted ">
        <button
          onClick={orderAgain}
          className=" text-red-600 hover:text-red-500 duration-150  text-[14px] sm:text-[16px] font-semibold"
        >
          ORDER AGAIN
        </button>
      </div>
    </div>
  );
};
