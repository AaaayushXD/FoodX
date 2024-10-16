import { useEffect, useState } from "react";
import Carousel from "../../Components/Carousel/Carousel";
import { getBanners } from "../../Services/banner.services";
import Skeleton from "react-loading-skeleton";
import { Banner as BannerModal } from "../../models/banner.model";

const Banner: React.FC = () => {
  const [initialData, setInitialData] = useState<BannerModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getBanner = async () => {
    setLoading(true);
    try {
      const response = await getBanners("banners");
      setInitialData(response.data.banners);
    } catch (error) {
      throw new Error("Error while fetching banners" + error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getBanner();
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="lg:h-[600px] lg:min-w-[700px] flex items-center min-w-[300px] w-[400px] h-[300px] sm:w-[600px] sm:h-[350px] md:w-[500px] md:h-[450px] duration-500 xl:w-[1000px] flex-grow">
        {loading ? (
          <div className="w-full rounded-xl  gap-4 flex ">
            <Skeleton
              borderRadius={"13px"}
              width="980px"
              height="545px"
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        ) : (
          <Carousel props={initialData} />
        )}
      </div>
    </div>
  );
};

export const Sponsor: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<BannerModal[]>([]);

  const getBanner = async () => {
    setLoading(true);
    try {
      const response = await getBanners("sponsors");

      setInitialData(response.data.banners);
    } catch (error) {
      throw new Error("Error while fetching banners" + error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getBanner();
  }, []);

  return (
    <div className="lg:flex hidden items-center justify-center w-full h-full">
      <div className="lg:h-[540px]  h-[300px] max-w-md sm:h-[350px] md:h-[382px] duration-500  flex-grow">
        {loading ? (
          <div className="w-full rounded-xl  gap-4 flex ">
            <Skeleton
              borderRadius={"13px"}
              width="450px"
              height="534px"
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        ) : (
          <img
            src={initialData[0]?.image}
            className="w-full rounded-xl h-full"
            alt="sponsor banner"
          />
        )}
      </div>
    </div>
  );
};

export default Banner;
