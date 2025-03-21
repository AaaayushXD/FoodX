import { Cart, PopularProduct, RecentProduct } from "../../components";


export const CartPage = () => {
  return (
    <div className="flex flex-col items-start  gap-10 w-full h-full py-6 px-2 sm:px-3 justify-between ">
      <div className="w-full h-full  flex lg:flex-row flex-col gap-[7rem] sm:gap-7  bg-[var(--light-foreground)] px-2 sm:px-8 py-10 rounded items-center lg:items-start justify-between">
        <div className="lg:w-[600px] w-full p-2 py-4   rounded">
          <Cart />
        </div>
        <RecentProduct />
      </div>
      <PopularProduct />
    </div>
  );
};
