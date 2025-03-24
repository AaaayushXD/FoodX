import { useNavigate, useParams } from "react-router-dom";
import Image from "@/assets/banner.png";
import { Icons } from "@/utils";
import { CategoryProduct } from "@/components";
import { useAllProducts } from "@/hooks/useAllProducts";
import { useEffect, useState } from "react";
import { ProductFilter, ProductSort } from "@/features";
import { productSort, Skeleton } from "@/helpers";
import { Empty, RippleButton } from "@/commons";
import EmptyImage from "@/assets/orderEmpty.webp";
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
  const [products, setProducts] = useState<Ui.Product[]>([]);

  const { products: data, isLoading } = useAllProducts();
  const categoryProducts = data?.filter((product) => product?.tagId === id);

  const { category: categories } = useAppSelector();

  const category = categories.categories?.find((cat) => cat.id === id);

  const navigate = useNavigate();

  useEffect(() => {
    setFilters((prev) => {
      const existingFilter = prev.find((filter) => filter.type === "sort");
      if (existingFilter?.value === sortData.value) return prev;

      const updatedFilters = prev.map((filter) =>
        filter.type === "sort"
          ? { ...filter, value: sortData?.value, label: sortData?.type }
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
  }, [sortData]);

  useEffect(() => {
    if (filters.length <= 0) {
      return setProducts(categoryProducts ?? []);
    }
    filters?.forEach((filter) => {
      if (filter?.value) {
        const filterProducts = productSort(
          categoryProducts,
          filter.value as Common.SortType
        );

        setProducts(filterProducts);
      }
    });
  }, [filters]);

  return (
    <div className="flex w-full bg-white h-full flex-col items-start justify-start gap-5">
      {/* Category Header */}
      <div
        style={{
          backgroundImage: `url(${category?.cover || Image})`,
        }}
        className="w-full relative flex items-start pt-5 pl-3 bg-right-bottom bg-no-repeat bg-cover h-[300px] sm:h-[400px]  transition-all ease-in-out duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <RippleButton
          onClick={() => navigate(-1)}
          className="text-white transition-transform duration-300"
        >
          {<Icons.arrowLeft />}
        </RippleButton>
        {/* Category Description */}
        <div className=" bottom-0 pb-2.5 absolute border-b-[1px] border-[var(--dark-border)] max-w-5xl w-full flex flex-col items-start justify-start">
          <h1 className="text-[20px] text-white tracking-wide sm:text-[25px] font-semibold">
            {category?.name}
          </h1>
          <p className="text-[14px] sm:text-[16px] text-gray-200">
            {category?.description ||
              "   Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, ex?    Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, ex?   Lorem ipsum dolor sit amet consectetur adipisicing elit.    . Facere, ex? Facere, ex?"}
          </p>
        </div>
      </div>

      {/* Filters and Sort Buttons */}
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="px-2 w-full overflow-auto flex items-center justify-start gap-5">
          <button
            onClick={() => setOpen(!open)}
            className="hover:text-blue-500"
          >
            <Icons.filterButton />
          </button>
          <button
            onClick={() => setOpenSort(!openSort)}
            className="hover:text-blue-500"
          >
            <Icons.sortButton />
          </button>

          {/* Active Filters */}
          <div className="flex w-full py-2 items-center gap-4 justify-start">
            {filters.map(
              (filter, index) =>
                filter.value && (
                  <div
                    key={index}
                    className="px-5 p-1 sm:py-1.5 rounded-full min-w-[170px] w-fit flex items-center justify-start gap-2 ring-[1px] hover:bg-gray-400 duration-150 cursor-pointer ring-[var(--secondary-text)] bg-gray-200 text-gray-600 text-[14px] transition-all ease-in-out"
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

        {/* Available Products Count */}
        <h1 className="w-1/2 lg:flex hidden justify-end text-end text-[18px] px-2 text-[var(--secondary-text)]">
          {products?.length} Products are available
        </h1>
      </div>

      {/* Mobile View Product Count */}
      <h1 className="lg:hidden flex text-start text-[18px] px-2 font-bold">
        {products?.length} Products are available
      </h1>

      {/* Product Cards */}
      <div className="w-full px-2 flex flex-col lg:flex-row items-start justify-start sm:gap-10 gap-6">
        {isLoading ? (
          <Skeleton
            children={{
              className:
                "max-w-full h-[150px] rounded-md sm:h-[180px] bg-gray-300",
            }}
            count={7}
            className="w-full h-full px-3 flex items-start gap-8 justify-start flex-col"
          />
        ) : products?.length <= 0 ? (
          <Empty image={EmptyImage} title="No products are available" />
        ) : (
          products?.map((product) => (
            <CategoryProduct key={product.id} {...product} />
          ))
        )}
      </div>

      {/* Filter and Sort Modals */}
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
