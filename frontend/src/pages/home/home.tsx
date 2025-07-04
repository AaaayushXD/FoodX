import { MenuType, Header, PopularProducts } from "@/components";
import { Banner, Specials, Sponsor } from ".";
import ErrorBoundary from "@/errorBoundary";
import { OrderNotification } from "@/features/notifications/order.notification";

export const Home = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <Header />
      <div className="px-3.5 w-full">
      <OrderNotification/>
     </div>
      <div className="w-full max-w-[1500px] sm:gap-10 gap-4 h-full flex flex-col px-3.5  flex-grow">
        <ErrorBoundary>
          <Banner />
        </ErrorBoundary>
        <div
          id="categories"
          className="flex items-center justify-center w-full"
        >
          <MenuType />
        </div>
        <PopularProducts />
        <div className="w-full flex ">
          <Sponsor />
        </div>
        <Specials />
      </div>
    </div>
  );
};
