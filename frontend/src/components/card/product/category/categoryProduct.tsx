import React, { useState } from "react";
import { Icons, toaster } from "@/utils";
import { useNavigate } from "react-router-dom";
import { EllipsePopup } from "@/components";
import { Heart } from "lucide-react";
import { useFavourite } from "@/hooks";
import { addProductToCart } from "@/services";
import { useAppDispatch, useAppSelector } from "@/hooks/useActions";
import { ApiError, handleShare, Image } from "@/helpers";
import { addToCart } from "@/reducer";
import toast from "react-hot-toast";
import PlaceholderImg from "@/assets/placeholder.webp";

export const CategoryProduct: React.FC<Ui.Product> = (product) => {
  const navigate = useNavigate();

  const {
    addFavouriteProduct,
    heartColor,
    removeFavouriteProduct,
    isFavourite,
  } = useFavourite(product.id);
  const { auth } = useAppSelector();
  const dispatch = useAppDispatch();

  async function handleProduct(product: Ui.Product) {
    const loading = toaster({
      message: "Please wait...",
      icon: "loading",
    });
    try {
      const response = await addProductToCart(
        auth?.userInfo?.uid as string,
        product?.id
      );
      if (response instanceof ApiError) {
        toaster({
          title: response?.message,
          icon: "error",
        });
      }
      dispatch(addToCart({ ...product, quantity: 1 }));
    } catch (error) {
      throw new Error("Error while adding product to cart " + error);
    } finally {
      toast.dismiss(loading);
    }
  }
  const [openEllipse, setOpenEllipse] = useState<boolean>(false);

  return (
    <div className="w-full group/category rounded-lg relative flex items-center justify-start gap-2 h-[150px] sm:h-[250px] ">
      {/* Image Section */}
      <div className="relative w-1/2  group-hover/category:scale-95 duration-150  cursor-pointer min-w-[135px] md:w-[280px] sm:w-[300px] h-full overflow-hidden rounded-xl shadow-lg">
        <Image
          lowResSrc={PlaceholderImg}
          className="w-full h-full object-cover rounded-lg"
          highResSrc={product.image}
          alt={product.name}
        />

        {/* Price & Item Name */}
        <div
          onClick={() => navigate(`/${product?.collection}/${product?.id}`)}
          className="absolute bottom-0  left-2 z-10 flex flex-col gap-0 items-start text-white"
        >
          <span className="text-[16px] sm:text-lg font-extrabold">ITEM</span>
          <p className="text-[18px] sm:text-2xl font-extrabold">
            AT Rs.{product.price}
          </p>
        </div>

        {/* Favorite Button */}
        <button
          className="absolute top-2 right-2 z-10 text-white"
          onClick={() =>
            isFavourite(product.id)
              ? removeFavouriteProduct()
              : addFavouriteProduct(product.id)
          }
        >
          <Heart className={`size-6 transition-all duration-150 ${heartColor}   sm:size-7`} />
        </button>

        {/* Gradient Overlays */}
        <div
          onClick={() => navigate(`/${product?.collection}/${product?.id}`)}
          className="absolute   inset-0 bg-gradient-to-b from-black/20 to-transparent"
        ></div>
        <div
          onClick={() => navigate(`/${product?.collection}/${product?.id}`)}
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"
        ></div>
      </div>

      {/* Details Section */}
      <div
        onClick={() => navigate(`/${product?.collection}/${product?.id}`)}
        className="w-full  cursor-pointer flex flex-col items-start justify-start gap-3"
      >
        <div className="flex flex-col text-sm sm:text-lg items-start gap-2">
          <h1 className="sm:text-[22px] text-[16px] font-semibold">
            {product.name}
          </h1>
          <div className="flex  w-full items-center font-semibold gap-1 text-[12px] sm:text-[16px] ">
            <h1 className="flex items-start gap-0.5 justify-start ">
              <button className="p-1 white bg-green-700 rounded-full">
                {" "}
                <Icons.tomato className=" size-2.5 sm:size-4 fill-white text-white" />{" "}
              </button>
              4.6 (1.9k+)
            </h1>
            <p>{product?.cookingTime || "20mins - 50mins"}</p>
          </div>
        </div>
        <p className="text-[14px] sm:text-[16px] text-gray-400">
          {product?.description ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. In non corrupti quae saepe expedita corporis."}
        </p>
      </div>

      {/* More Options Button */}
      <button
        className="absolute top-0 right-2 text-[var(--dark-text)]  rounded-full"
        onClick={() => setOpenEllipse(!openEllipse)}
      >
        {openEllipse ? (
          <Icons.close className="size-6 text-red-700 sm:size-8" />
        ) : (
          <Icons.ellipse className="size-6 sm:size-8" />
        )}
      </button>
      {openEllipse && (
        <EllipsePopup
          action={() => setOpenEllipse(!openEllipse)}
          isOpen={openEllipse}
          className="right-8 flex text-white text-[12px] p-2 sm:text-[14px] flex-col items-start justify-start gap-1 top-4 "
        >
          <button
            onClick={() => handleProduct({ ...product })}
            className=" flex items-center justify-start gap-2  border-b-[1px] border-[var(--dark-border)] pb-2 "
          >
            <Icons.shoppingBag className="size-4" />
            Add to cart
          </button>
          <button
            onClick={() => handleShare(product?.name)}
            className=" flex items-center justify-start gap-2  "
          >
            <Icons.share className="size-4" />
            Share
          </button>
        </EllipsePopup>
      )}
    </div>
  );
};
