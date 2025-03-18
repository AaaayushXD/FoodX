import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { RecentProductCard } from "@/components";
import { getOrderByUser } from "@/services";
import Empty from "@/assets/empty.png";
import { useAppSelector } from "@/hooks";
import { Icons } from "@/utils";

export const RecentProduct = () => {
  const [initialData, setInitialData] = useState<Ui.Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { auth } = useAppSelector();

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await getOrderByUser({
        pageSize: 5,
        filter: "orderRequest",
        sort: "desc",
        currentFirstDoc: null,
        currentLastDoc: null,
        direction: "next",
      });
      const aggregateProducts = response.data.orders?.flatMap(
        (order: any) => order.products
      );
      const uniqueProducts = Array.from(
        new Set(aggregateProducts.map((product: any) => product.id))
      ).map((id) =>
        aggregateProducts.find((product: any) => product.id === id)
      );
      setInitialData(uniqueProducts);
    } catch (error) {
      setInitialData([]);
      // throw new Error("Error while getting popular products" + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    auth?.success ? getProducts() : "";
  }, []);

  const navigate = useNavigate();

  return (
    <div className="lg:w-[550px] text-[var(--dark-text)] w-full flex h-full flex-col gap-4 pt-3  border border-[var(--dark-border)]  rounded-lg">
      <h3 className="w-full text-[18px] px-4 sm:text-[25px]  py-2 font-semibold tracking-wide text-[var(--dark-text)]">
        Recent Products
      </h3>
      <div className="w-full h-full overflow-y-auto item-scrollbar px-1 sm:px-5 ">
        <div className="flex  flex-col w-full items-start h-[530px]  gap-5">
          {auth.success ? (
            !loading ? (
              initialData?.length > 0 ? (
                initialData &&
                initialData?.map((data) => (
                  <RecentProductCard prop={data} key={data.id} />
                ))
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <img
                    src={Empty}
                    alt="No products found"
                    className="size-40 mb-4"
                  />
                  <h4 className="text-xl text-[var(--dark-secondary-text)] mb-2">
                    No products found
                  </h4>
                  <p className="text-sm text-[var(--dark-secondary-text)] mb-4">
                    Looks like you haven’t ordered anything recently.
                  </p>
                  <button
                    onClick={() => navigate("/#categories")}
                    className="mt-4 duration-150 bg-[var(--primary-light)] text-white py-2 px-4 rounded hover:bg-[var(--primary-dark)]"
                  >
                    Browse Categories
                  </button>
                </div>
              )
            ) : (
              <div className="w-full ">
                <Skeleton
                  height={90}
                  baseColor="var(--light-background)"
                  highlightColor="var(--light-foreground)"
                  count={5}
                />
              </div>
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <Icons.frown className="size-32 text-[var(--dark-secondary-text)] " />
              <p className="text-lg text-[var(--dark-secondary-text)] mb-4">
                You are not logged in!
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-[var(--primary-light)] text-white py-2 px-4 rounded hover:bg-[var(--primary-color)] "
              >
                Log in to see your products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
