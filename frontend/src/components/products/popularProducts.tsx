import { useEffect, useState } from "react";
import { getPopularProducts } from "@/services";
import { useNavigate } from "react-router-dom";
import Empty from "@/assets/empty.png";
import { PopularProduct } from "@/components";
import { ApiError, Skeleton } from "@/helpers";
import { Empty as EmptyComponent } from "@/commons";
import { toaster } from "@/utils";
import { useQuery } from "react-query";
import { useAllProducts } from "@/hooks";

export const PopularProducts = () => {
  const navigate = useNavigate();
  const { products, isLoading: loading } = useAllProducts();

  const getProducts = async (): Promise<Ui.Product[]> => {
    try {
      const response = await getPopularProducts();
      const filterProducts = products?.filter((product) =>
        response?.data?.some((pro) => pro.id === product.id)
      );
      return filterProducts;
    } catch (error) {
      throw new Error("Error while fetching popular product", error);
    }
  };

  const { data, isLoading } = useQuery("products:popular", {
    queryFn: getProducts,
    cacheTime: 10 * 60 * 60,
    staleTime: 10 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled: !loading,
  });

  return (
    <div className="w-full h-full text-[var(--dark-text)] relative group/popular flex flex-col gap-6 rounded items-start justify-center ">
      <h1 className="sm:text-[25px]  text-[18px] tracking-wide font-semibold    ">
        Explore to popular products
      </h1>
      {isLoading ? (
        <Skeleton
          children={{
            className:
              "sm:max-w-[230px] rounded-md max-w-[200px] h-[120px] sm:h-[180px]",
          }}
          className="w-full h-full grid   sm:grid-cols-3 grid-cols-2 gap-4 lg:grid-cols-4 "
          count={8}
        />
      ) : (
        <div className="w-full   gap-y-4 grid grid-cols-2   sm:grid-cols-3 lg:grid-cols-4 gap-x-6 sm:gap-14  ">
          {data?.map((product) => (
            <PopularProduct {...product} key={product.id} />
          ))}
        </div>
      )}
      {data?.length <= 0 && !isLoading && (
        <EmptyComponent
          image={Empty}
          action={() => navigate("#categories")}
          title="  No popular products found"
          actionTitle="Browse Categories"
          description="It seems there are no popular products at the moment. Check back
  soon or explore our categories for more options!"
        />
      )}
    </div>
  );
};
