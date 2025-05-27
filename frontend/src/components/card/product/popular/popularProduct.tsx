import React from "react";
import { Icons } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Image } from "@/helpers";
import Img from "@/assets/placeholder.svg";
import { useAppSelector, useRating } from "@/hooks";

export const PopularProduct: React.FC<Ui.Product> = (product) => {
  const navigate = useNavigate();
  const { product: productList } = useAppSelector();
  const eachProduct = productList?.products?.find(
    (pro) => pro?.id === product?.id
  );

  const ratings = useRating(eachProduct?.id as string);
  const rating = ratings?.data?.filter(
    (rating) => rating?.productId === eachProduct?.id
  );

  return (
    <div
      onClick={() =>
        navigate(`/${eachProduct?.collection || "products"}/${product.id}`)
      }
      className=" h-full max-w-[250px] cursor-pointer flex flex-col  gap-1.5  items-start justify-start rounded-lg w-full lg:max-w-[400px] "
    >
      <div className=" w-full relative">
        <Image
          lowResSrc={Img}
          className="w-full  md:h-[200px] h-[140px]  sm:h-[180px] object-cover rounded-lg  "
          highResSrc={import.meta.env.VITE_URI + "assets/" + product?.image}
          alt={product?.name}
        />
      </div>
      <div className="w-full h-full flex  flex-col items-center justify-start gap-0.5 ">
        <div className="flex sm:text-lg text-[14px] gap-3 w-full items-center justify-between ">
          <h1 className=" text-[14px] text-[var(--secondary-text)]  ">
            {product.name}
          </h1>
          <span className=" flex items-center font-semibold justify-center gap-1 text-red-500">
            <Icons.tomato className="fill-red-500 " /> {rating?.length || 0}
          </span>
        </div>
        <div className=" text-[13px] sm:text-sm w-full flex items-center justify-between text-[var(--secondary-text)] ">
          <p className=" sm:text-[18px] text-[16px] text-[var(--primary-dark)] font-semibold ">
            Rs. {product?.price}
          </p>
          <p className=" sm:text-[14px] text-[12px] ">
            {product?.cookingTime || "15mins - 20mins"}
          </p>
        </div>
      </div>
    </div>
  );
};
