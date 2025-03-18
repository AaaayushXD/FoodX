import React, { useEffect, useState } from "react";
import { Payment } from "@/features";
import { Cart, SingleCard } from "@/components";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/utils";
import { useAppSelector } from "@/hooks";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full gap-8 ">
      <div className="w-full sm:py-5 py-4 fixed top-0 left-0 right-0 z-[100] bg-white flex items-center justify-between px-2">
        <button onClick={() => navigate(-1)}>
          <Icons.arrowLeft />
        </button>
        <h1 className=" font-semibold text-[16px] text-[var(--secondary-text)] sm:text-[20px] ">
          Checkout
        </h1>
        <div></div>
      </div>
      <div className="flex flex-col pt-16 sm:pt-24 px-2 items-center justify-evenly w-full gap-10 md:flex-row ">
        <Cart />
        <Payment />
      </div>
    </div>
  );
};

export const Items = () => {
  const [initialData, setInitialData] = useState<Ui.Product[]>([]);

  const { cart } = useAppSelector();

  const totalPrice = cart.products?.reduce(
    (acc, product) => acc + product?.price * product.quantity,
    0
  );

  // useEffect(() => {
  //   setInitialData(cart.products);
  // }, [cart.products]);

  // const dispatch = useDispatch<AppDispatch>();

  // const makeDiscount = async (event: FormEvent) => {
  //   const getDiscountFromSession = sessionStorage.getItem("discount");
  //   const getAmountFromSession = sessionStorage.getItem("products");
  //   if (getDiscountFromSession && getAmountFromSession)
  //     return toast.error("Already Applied");
  //   event.preventDefault();
  //   if (couponCode === "FOODX NEPAL") {
  //     const productsWithDiscount = calculateDiscountedPrice(products, 1);
  //     setDiscount(1);
  //     sessionStorage.setItem("discount", JSON.stringify(1));
  //     sessionStorage.setItem("products", JSON.stringify(productsWithDiscount));
  //   }
  // };

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 ">
      <h1 className="text-xl font-semibold tracking-wider text-[var(--dark-text)] ">
        Your Items
      </h1>
      <div className="w-full flex flex-col  gap-4  min-h-fit  ">
        {initialData?.length > 0 ? (
          initialData?.map((data) => <SingleCard prop={data} key={data.id} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 gap-9">
            <Icons.shoppingBag className=" text-[var(--dark-text)] cursor-pointer size-20" />

            <h1 className="text-[25px] tracking-wider text-[var(--dark-text)] ">
              Your cart is empty
            </h1>
          </div>
        )}
      </div>
      {/* coupon */}
      <div className="flex flex-col w-full p-5  gap-2 rounded-lg bg-[var(--light-background)] ">
        <div
          className={` ${
            cart.products?.length > 3 ? "h-20" : "h-auto"
          } overflow-auto scrollbar-custom pr-4 `}
        >
          {cart.products?.map((product) => (
            <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
              <span className="text-[16px]">{product.name}</span>
              <div>
                <span className="text-[16px]">{product.quantity || "0"} </span>{" "}
                × <span className="text-[16px]">{product.price || "0"} </span>
              </div>
            </div>
          ))}
        </div>
        <div className=" text-[17px] border-t-[3px] pt-2  border-[var(--dark-border)] font-semibold tracking-wider flex justify-between items-center ">
          <span className="text-[var(--dark-text)] "> Total Amount</span>
          <span className="text-[var(--green-bg)] ">Rs. {totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

// Discount coupon component
{
  /* <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Cart Subtotal</span>
          <span className="text-[16px]">Rs. {totalPrice} </span>
        </div>
        <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Tax</span>
          <span className="text-[16px]">Rs. 0</span>
        </div> */
}
{
  /* <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Discount (Each Product)</span>
          <span className="text-[16px]">Rs. {discount || "0"} </span>
        </div> */
}
{
  /* <form
          onSubmit={(event: FormEvent) => makeDiscount(event)}
          className="w-full flex p-2 rounded-lg bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] "
        >
          <input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            type="text"
            className=" p-1 outline-none rounded-lg w-full px-2  placeholder:text-[15px] font-semibold text-[var(--dark-secondary-text)] bg-[var(--light-foreground)] "
            placeholder="Enter coupon code"
          />
          <button
            disabled={discount ? true : false}
            type="submit"
            className=" border-l-2 border-[var(--dark-border)] pl-5 text-[var(--dark-secondary-text)] text-[16px]  font-semibold tracking-wider "
          >
            {(discount && "Applied") || "Apply"}
          </button>
        </form> */
}
