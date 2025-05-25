import { Empty } from "@/common";
import { PopularProduct } from "@/components";
import { Skeleton } from "@/helpers";
import { Icons } from "@/utils";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmptyImage from "@/assets/empty.png";

export const BannerProduct = () => {
  const navigate = useNavigate();
  const { bannerProduct } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [sortData, setSortData] = useState<{ type: string; value: string }>({
    type: "",
    value: "",
  });
  const [products, setProducts] = useState<Ui.Product[]>([]);

  return (
    <div className="flex w-full h-full  flex-col items-start justify-start gap-5 ">
      <div
        style={{
          backgroundImage: `url(${Image})`,
        }}
        className=" w-full flex items-start  pt-5 pl-3  bg-right-bottom bg-no-repeat bg-cover h-[100px] "
      >
        <button onClick={() => navigate(-1)} className="  text-white ">
          {<Icons.arrowLeft />}
        </button>
      </div>
      <div className=" px-2 border-b-[1px] border-[var(--dark-border)] pb-5 w-full flex flex-col items-start justify-start gap-4  ">
        <h1 className=" text-[18px] sm:text-[20px] font-bold ">Thakali Set</h1>
        <p className=" text-[16px] sm:text-[18px] text-[var(--dark-secondary-text)] ">
          Converse, an iconic American footwear brand, has been synonymous with
          rebellion, self-expression, and timeless style since its inception in
          1908. Renowned for its classic Chuck Taylor All Star sneakers.
        </p>
      </div>
      <div className=" px-2 w-full overflow-auto  flex items-center justify-start gap-5">
        <button onClick={() => setOpen(!open)}>
          <Icons.filterButton />
        </button>
        <button onClick={() => setOpenSort(!openSort)}>
          <Icons.sortButton />
        </button>
        <div className="flex w-full  items-center gap-2 justify-start">
          {filters.map(
            (filter, index) =>
              filter.value && (
                <div
                  key={index}
                  className=" px-5 p-1
         rounded-full min-w-fit flex items-center justify-start gap-2  bg-[var(--primary-color)] text-white text-[14px] "
                >
                  {filter.label.charAt(0).toUpperCase() +
                    filter?.label?.slice(1)}
                  <button
                    onClick={() =>
                      setFilters((prev) =>
                        prev.filter((value) => value.type !== filter.type)
                      )
                    }
                  >
                    <Icons.close strokeWidth={2} />
                  </button>
                </div>
              )
          )}
        </div>
      </div>
      <h1 className=" text-[18px] px-2 font-bold ">
        {products?.length} Products are available
      </h1>
      <div className="w-full px-2 flex flex-col items-start justify-start gap-6">
        {isLoading ? (
          <Skeleton
            children={{
              className: "max-w-full h-[150px]  rounded-md sm:h-[180px] ",
            }}
            count={7}
            className="w-full h-full px-3  flex items-start gap-8 justify-start flex-col"
          />
        ) : products?.length <= 0 ? (
          <Empty image={EmptyImage} title="No products are available" />
        ) : (
          products?.map((product) => (
            <PopularProduct key={product.id} {...product} />
          ))
        )}
      </div>
    </div>
  );
};
