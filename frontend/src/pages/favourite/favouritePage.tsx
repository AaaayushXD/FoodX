import React, { useEffect, useState } from "react";
import { Icons } from "../../utils";
import { useAppSelector } from "../../hooks/useActions";
import { useAllProducts } from "../../hooks/useAllProducts";
import { CategoryProduct } from "../../components";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/helpers";
import { Empty } from "@/commons";
import EmptyImage from "@/assets/empty.png";

export const FavouritePage: React.FC = () => {
  const store = useAppSelector();
  const [initialProducts, setInitialProducts] = useState<Ui.Product[]>([]);

  const { data: products, isFetched, isLoading } = useAllProducts();

  const getAllProducts = async () => {
    try {
      const aggregateProducts = products?.filter((data) =>
        store?.favourite?.favourite?.includes(data.id)
      );
      setInitialProducts(aggregateProducts as Ui.Product[]);
    } catch (error) {
      throw new Error("Error while fetching  all products" + error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isFetched && products) {
      getAllProducts();
    }
  }, [store.favourite.favourite, isFetched]);

  return (
    <div className="w-full  flex flex-col items-start justify-start">
      <div className=" w-full py-3 fixed top-0 bg-white left-0 right-0 px-3 z-[100] flex items-center justify-between -white ">
        <button onClick={() => navigate(-1)}>
          <Icons.arrowLeft />
        </button>
        <h1 className="font-semibold text-[16px] text-[var(--secondary-text)] sm:text-[20px] ">FAVOURITES</h1>
        <div></div>
      </div>
      <div className="w-full pt-20   px-2 flex flex-col items-start justify-start gap-8">
      <h1 className=" text-[18px] font-semibold ">Your favourite product</h1>
        {isLoading ? (
          <Skeleton
            children={{
              className: "max-w-full h-[100px]  rounded-md sm:h-[180px] ",
            }}
            count={7}
            className="w-full h-full px-2  flex items-start gap-8 justify-start flex-col"
          />
        ) : initialProducts?.length <= 0 ? (
          <Empty
            title="You don't have your favourite products"
            image={EmptyImage}
            action={() => navigate("#categories")}
            actionTitle="Browse Categories"
          />
        ) : (
          initialProducts?.map((product) => (
            <CategoryProduct key={product.id} {...product} />
          ))
        )}
      </div>
    </div>
  );
};
