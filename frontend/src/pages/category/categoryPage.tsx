import { useNavigate, useParams } from "react-router-dom";
import Image from "@/assets/banner.png";
import { Icons } from "@/utils";
import { getProductsByTag } from "@/services";
import { useQuery } from "react-query";
import { CategoryProduct } from "@/components";
import { specialProducts } from "@/hooks/useAllProducts";
import { useEffect, useState } from "react";
import { ProductFilter, ProductSort } from "@/features";
import { productSort, Skeleton } from "@/helpers";
import { Empty } from "@/commons";
import EmptyImage from "@/assets/EmptyOrder.png";

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
  const [products, setProducts] = useState<Ui.Product[]>([]);

  const { id } = useParams();
  const { data: specials } = specialProducts();

  const getMenuProducts = async (): Promise<Ui.Product[]> => {
    try {
      if (!id) return [];
      const response = await getProductsByTag(id as string);
      const aggregateAllProducts = response?.data?.map((product) => {
        return {
          ...product,
          collection: "products" as Common.ProductCollection,
        };
      });
      const aggregateSpecialData = specials?.filter(
        (product: Ui.Product) => product?.tagId === id
      );
      return [
        ...aggregateAllProducts,
        ...(aggregateSpecialData as Ui.Product[]),
      ];
    } catch (error) {
      throw new Error("Error while getting products by tag" + error);
    }
  };

  const { data, isLoading } = useQuery(["category-01", id], getMenuProducts, {
    enabled: !!id && specials && specials?.length > 0 ? true : false,
    refetchOnWindowFocus: false,
    cacheTime: 1 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data && data?.length > 0 && !isLoading) {
      setProducts(data as Ui.Product[]);
    }
  });

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
