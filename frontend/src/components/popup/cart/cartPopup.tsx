import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import { Icons } from "@/utils";

export const CartPopup = () => {
  const { cart } = useAppSelector();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div
      className={`w-full bg-white  lg:bg-transparent border-none  p-2  border-t ${
        pathname === "/checkout"
          ? " hidden"
          : cart.products.length > 0
          ? "flex "
          : "hidden"
      } flex items-center justify-between`}
    >
      <div className="w-full lg:hidden flex items-center justify-between">
        <div className="w-full flex items-center justify-start gap-3   ">
          <button className=" relative bg-[var(--primary-dark)] size-12 sm:size-14 flex items-center justify-center rounded-full ">
            <Icons.shoppingCart className="size-6 text-white sm:size-7" />
            <p className=" text-xs bg-red-700 p-1 size-5 flex items-center justify-center text-white absolute right-2 top-1/2 rounded-full ">
              {cart?.products?.length}
            </p>
          </button>
          <div className="flex flex-col items-start">
            <h1 className=" text-[14px] text-[var(--dark-secondary-text)] sm:text-[18px]  ">
              Total Amount
            </h1>
            <p className=" text-[18px] font-bold ">
              Rs.{" "}
              {cart.products?.reduce(
                (productAcc, product) =>
                  productAcc + product.price * product.quantity,
                0
              )}{" "}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="  sm:text-[20px]  py-2 text-white text-[16px] font-semibold rounded-3xl px-3 justify-center gap-1 flex items-center bg-green-600 "
        >
          Checkout
          <Icons.chevronRight className="size-5 text-white" />
        </button>
      </div>

      <button onClick={()=> navigate("/checkout")} className="  lg:flex relative bg-[var(--primary-dark)] size-12 sm:size-14 hidden items-center justify-center rounded-full ">
        <Icons.shoppingCart className="size-6 text-white sm:size-7" />
        <p className=" text-xs bg-red-700 p-1 size-5 flex items-center justify-center text-white absolute right-2 top-1/2 rounded-full ">
          {cart?.products?.length}
        </p>
      </button>
    </div>
  );
};
