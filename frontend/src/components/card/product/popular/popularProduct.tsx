import React from "react";
import { Icons } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Image } from "@/helpers";
import Img from "@/assets/placeholder.webp"

export const PopularProduct: React.FC<Ui.Product> = (product) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/${product?.collection || "products"}/${product.id}`)}
      className=" h-full cursor-pointer flex flex-col  gap-1.5 items-start justify-start rounded-lg w-full"
    >
      <div className=" w-full relative">
        <Image
          lowResSrc={Img}
          className="w-full h-[160px] sm:h-[180px] md:h-[200px] object-cover rounded-lg  "
          highResSrc={product.image}
          alt={product.name}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t rounded-b-lg from-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b rounded-b-lg from-transparent to-black/50"></div>
      </div>
      <div className="w-full h-full flex  flex-col items-center justify-start gap-1 ">
        <div className="flex sm:text-lg text-[14px] gap-3 w-full items-center justify-between ">
          <h1 className=" font-bold sm:text-[18px] text-[16px] ">{product.name}</h1>
          <span className=" flex items-center font-semibold justify-center gap-1 text-red-500">
            <Icons.tomato className="fill-red-500 " /> 49
          </span>
        </div>
        <div className=" text-[13px] sm:text-sm w-full flex items-center justify-between text-[var(--dark-secondary-text)] ">
          <p>Rs. { product?.price}</p>
          <p>{ product?.cookingTime }</p>
        </div>
      </div>
    </div>
  );
};
