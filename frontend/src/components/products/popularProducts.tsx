import { getPopularProducts } from "@/services";
import { useNavigate } from "react-router-dom";
import Empty from "@/assets/empty.png";
import { PopularProduct } from "@/components";
import { Skeleton } from "@/helpers";
import { Empty as EmptyComponent, Error as ErrorComponent } from "@/commons";
import { useQuery } from "@tanstack/react-query";

export const PopularProducts = () => {
  const navigate = useNavigate();

  const getProducts = async (): Promise<Ui.Product[]> => {
    try {
      const response = await getPopularProducts();
      return response.data;
    } catch (error) {
      throw new Error("Error while fetching popular products" + error);
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["product:popular"],
    queryFn: getProducts,
    gcTime: 10 * 60 * 60,
    staleTime: 10 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-full h-full text-[var(--dark-text)] relative group/popular flex flex-col gap-6 rounded items-start justify-center ">
      <h1 className="sm:text-[25px]  text-[18px] tracking-wide font-semibold    ">
        Explore to popular products
      </h1>
      {isError ? (
        <ErrorComponent
          message={error?.message}
          button={{
            onClick: () => refetch(),
            title: "Refresh",
          }}
          title="Something went wrong"
        />
      ) : isLoading ? (
        <Skeleton
          children={{
            className:
              "sm:max-w-[230px] rounded-md w-full h-[120px] sm:h-[180px]",
          }}
          className="w-full h-full grid   sm:grid-cols-3 grid-cols-2 gap-4 lg:grid-cols-4 "
          count={8}
        />
      ) : (
        <div className="w-full   grid grid-cols-2  justify-center gap-6  sm:grid-cols-3 lg:grid-cols-4  ">
          {data && data?.length <= 0 && !isLoading ? (
            <EmptyComponent
              image={Empty}
              action={() => navigate("#categories")}
              title="  No popular products found"
              actionTitle="Browse Categories"
              description="It seems there are no popular products at the moment. Check back
  soon or explore our categories for more options!"
            />
          ) : (
            data?.map((product) => (
              <PopularProduct {...product} key={product.id} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
