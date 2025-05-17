import { Carousel } from "@/components";
import { getBanners } from "@/services";
import { ApiError, Skeleton } from "@/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Error } from "@/commons";
import { toaster } from "@/utils";

export const Banner: React.FC = () => {
  const getBanner = async (): Promise<Ui.Banner[]> => {
    try {
      const response = await getBanners("banners");
      return response.data && (response.data.banners as Ui.Banner[]);
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          icon: "error",
          message: error?.message,
          className: "bg-red-50",
        });
      }
    }
  };

  const query = useQueryClient();
  const previousData = query.getQueryData<Ui.Banner[]>(["banner"]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["banner"],
    queryFn: getBanner,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  if (isError) {
    return (
      <Error
        message="Error while fetching banners"
        button={{
          title: "Refresh",
          onClick: () => refetch(),
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className=" w-full h-[120px] sm:h-[400px] ">
        {isLoading ? (
          <Skeleton
            children={{
              className: "w-full h-[100px] sm:h-[250px] rounded-lg",
            }}
            className="w-full h-full"
            count={1}
          />
        ) : (
          data &&
          data.length > 0 && (
            <Carousel props={data as Ui.Banner[]} time={5000} />
          )
        )}
      </div>
    </div>
  );
};

export const Sponsor: React.FC = () => {
  const getSponsors = async (): Promise<Ui.Banner[]> => {
    try {
      const response = await getBanners("sponsors");
      return response.data.banners as Ui.Banner[];
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          icon: "error",
          message: error?.message,
          className: "bg-red-50",
        });
      }
      throw new ApiError(400);
    }
  };

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["sponsors"],
    queryFn: getSponsors,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="items-center justify-center  w-full h-full flex">
      <div
        className={`w-full ${isError ? "h-full" : "h-[100px]"} sm:h-[300px]`}
      >
        {isLoading ? (
          <Skeleton
            children={{
              className: "w-full h-[100px] sm:h-[200px] rounded-lg",
            }}
            className="w-full h-full"
            count={1}
          />
        ) : isError || data === undefined ? (
          <Error
            button={{ onClick: () => refetch(), title: "Refresh" }}
            message={error?.message}
          />
        ) : (
          data &&
          data.length > 0 && (
            <div className="w-full h-full">
              <Carousel
                key={1}
                actions={false}
                props={data as Ui.Banner[]}
                time={25000}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};
