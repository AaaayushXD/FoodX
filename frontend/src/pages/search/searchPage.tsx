import { useCallback, useState } from "react";
import { CategoryProduct, NotificationLoader } from "@/components";
import { ProductSearch } from "@/features";
import { debounce, Icons } from "@/utils";
import { useAllProducts } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { Empty as EmptyComponent } from "@/commons";
import Empty from "@/assets/empty.png";

export const SearchPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<Ui.Product[]>([]);
  const { isError, isLoading, products } = useAllProducts();

  const handleSearch = async (value: string) => {
    if (value.length <= 0) {
      return setSearchData([]);
    }
    if (isLoading) return;
    setLoading(isLoading);
    try {
      const filter = await searchProducts(value);
      setSearchData(filter as Ui.Product[]);
    } catch (error) {
      throw new Error("Error while search product" + error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (value: string) => {
    if (!isLoading) {
      const filterProducts = products?.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      return filterProducts as Ui.Product[];
    }
  };

  const debounceSearch = useCallback(debounce(handleSearch, 200), [products]);

  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-stretch justify-start gap-8 px-2 py-5">
      <div className="w-full flex items-center justify-between">
        <button onClick={() => navigate("/")}>
          <Icons.arrowLeft />
        </button>
        <h1 className="font-semibold text-[16px] text-[var(--secondary-text)] sm:text-[20px] ">
          Search for dishes
        </h1>
        <div></div>
      </div>
      <ProductSearch action={(value) => debounceSearch(value)} />
      {/* <MenuType /> */}
      <div className="w-full flex flex-col items-start justify-start gap-5">
        <h1 className="sm:text-[22px] text-[18px] font-bold text-gray-800">
          {searchData?.length} products are found{" "}
        </h1>
        <div className="w-full flex items-center justify-start gap-10 flex-wrap">
          {loading ? (
            <NotificationLoader />
          ) : searchData.length <= 0 ? (
            <EmptyComponent image={Empty} title="Search Products" />
          ) : (
            searchData?.map((product) => (
              <CategoryProduct {...product} key={product.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
