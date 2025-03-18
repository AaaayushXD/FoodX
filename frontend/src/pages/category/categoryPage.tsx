import { useNavigate, useParams } from "react-router-dom";
import Image from "@/assets/banner.png";
import { Icons } from "@/utils";
import { getProductsByTag } from "@/services";
import { useQuery } from "react-query";
import { CategoryProduct } from "@/components";
import { specialProducts, useAllProducts } from "@/hooks/useAllProducts";
import { useEffect, useState } from "react";
import { ProductFilter, ProductSort } from "@/features";
import { productSort, Skeleton } from "@/helpers";
import { Empty } from "@/commons";
import EmptyImage from "@/assets/EmptyOrder.png";
import { useAppSelector } from "@/hooks";

export const CategoryPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<
    {
      type: string;
      value: string;
      label: string;
    }[]
  >([]);
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [sortData, setSortData] = useState<{ type: string; value: string }>({
    type: "",
    value: "",
  });

  const { id } = useParams();

  const { products, isLoading } = useAllProducts();

  const filterProducts = products?.filter((product) => product?.tagId === id);

  const { category: categories } = useAppSelector();

  const category = categories.categories?.find((cat) => cat.id === id);

  const navigate = useNavigate();

  useEffect(() => {
    setFilters((prev) => {
      const updatedFilters = prev.map((filter) =>
        filter.type === "sort"
          ? { ...filter, value: sortData.value, label: sortData.type }
          : filter
      );

      const isSortFilterExist = updatedFilters.some(
        (filter) => filter.label === sortData.type
      );
      return isSortFilterExist
        ? updatedFilters
        : [
            ...updatedFilters,
            { type: "sort", value: sortData.value, label: sortData.type },
          ];
    });
  }, [sortData.value]);

  useEffect(() => {
    filters?.forEach((filter) => {
      if (filter.value) {
        const filterProducts = productSort(
          products,
          filter.value as Common.SortType
        );
        setProducts(filterProducts);
      }
    });
  }, [filters, products]);

  return (
    <div className="flex w-full h-full  flex-col items-start justify-start gap-5 ">
      <div
        style={{
          backgroundImage: `  url(${category?.cover || Image})`,
        }}
        className=" w-full flex items-start  pt-5 pl-3  bg-right-bottom bg-no-repeat bg-cover h-[100px] "
      >
        <button onClick={() => navigate(-1)} className="  text-white ">
          {<Icons.arrowLeft />}
        </button>
      </div>
      <div className=" px-2 border-b-[1px] border-[var(--dark-border)] pb-5 w-full flex flex-col items-start justify-start gap-4  ">
        <h1 className=" text-[20px] tracking-wide sm:text-[22px] font-semibold ">
          {category?.name}
        </h1>
        <p className=" text-[16px] sm:text-[18px] text-[var(--dark-secondary-text)] ">
          {category?.description}
        </p>
      </div>
      <div className="w-full  mb-4 flex items-center justify-between ">
        <div className=" px-2 w-full overflow-auto  flex items-center justify-start gap-5">
          <button onClick={() => setOpen(!open)}>
            <Icons.filterButton />
          </button>
          <button onClick={() => setOpenSort(!openSort)}>
            <Icons.sortButton />
          </button>

          <div className="flex w-full py-2  items-center gap-4 justify-start">
            {filters.map(
              (filter, index) =>
                filter.value && (
                  <div
                    key={index}
                    className=" px-5 p-1 sm:py-1.5
             rounded-full min-w-[170px] w-fit flex items-center justify-start gap-2 ring-[1px] hover:bg-gray-400 duration-150 cursor-pointer ring-[var(--secondary-text)]   bg-gray-200  text-gray-600 text-[14px] "
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
        <h1 className=" w-1/2 lg:flex hidden text-end text-[18px] px-2 font-bold ">
          {products?.length} Products are available
        </h1>
      </div>
      <h1 className="  lg:hidden flex text-start text-[18px] px-2 font-bold ">
        {products?.length} Products are available
      </h1>
      <div className="w-full px-2 flex flex-col lg:flex-row items-start justify-start sm:gap-10 gap-6">
        {isLoading ? (
          <Skeleton
            children={{
              className: "max-w-full h-[150px]  rounded-md sm:h-[180px] ",
            }}
            count={7}
            className="w-full h-full px-3  flex items-start gap-8 justify-start flex-col"
          />
        ) : filterProducts?.length <= 0 ? (
          <Empty image={EmptyImage} title="No products are available" />
        ) : (
          filterProducts?.map((product) => (
            <CategoryProduct key={product.id} {...product} />
          ))
        )}
      </div>
      {open && (
        <ProductFilter
          setFilterData={setFilters}
          filterData={filters}
          close={() => setOpen(!open)}
          isOpen={open}
        />
      )}
      {openSort && (
        <ProductSort
          close={() => setOpenSort(!openSort)}
          isOpen={openSort}
          sortData={sortData}
          setSortData={setSortData}
        />
      )}
    </div>
  );
};
