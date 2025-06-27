import React, { useState } from "react";
import { Icons, toaster } from "@/utils";
import { useNavigate } from "react-router-dom";
import { EllipsePopup } from "@/components";
import { Heart } from "lucide-react";
import { useFavourite } from "@/hooks";
import { addProductToCart, get_productFeedback } from "@/services";
import { useAppDispatch, useAppSelector } from "@/hooks/useActions";
import { ApiError, handleShare, Image } from "@/helpers";
import { addToCart } from "@/reducer";
import toast from "react-hot-toast";
import PlaceholderImg from "@/assets/placeholder.svg";
import { RippleButton } from "@/common";
import { useQuery } from "@tanstack/react-query";

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
      if (!auth?.userInfo?.uid) {
        toaster({
          title: "Authentication Required",
          icon: "warning",
          className: "bg-yellow-50 text-white",
          message: "Please login to add product to cart",
        });
        return;
      }
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

  const { data: rating } = useQuery({
    queryKey: ["product:review"],
    queryFn: () =>
      get_productFeedback({ currentFirstDoc: null, currentLastDoc: null }),
  });

  const productRating = rating?.data?.feedbacks?.filter(
    (feedback) => feedback?.productId === product?.id
  );

  return (
    <div className="w-full  lg:bg-white group/category bg-transparent  rounded-lg relative flex items-center justify-start gap-2 sm:gap-5 h-[150px] sm:h-[200px] ">
      {/* Image Section */}
      <div className="relative w-1/2 cursor-pointer min-w-[135px] md:w-[280px] sm:w-[300px] h-full overflow-hidden rounded-xl shadow-lg">
        <Image
          lowResSrc={PlaceholderImg}
          className="w-full h-full transform scale-100 group-hover/category:scale-110 duration-150 transition-transform object-cover rounded-lg"
          highResSrc={import.meta.env.VITE_URI + "assets/" + product?.image}
          alt={product.name}
        />

        {/* Price & Item Name */}
        <div
          onClick={() => navigate(`/${product?.collection}/${product?.id}`)}
          className="absolute bottom-0 left-2 z-10 flex flex-col gap-0 items-start text-white"
        >
          <span className="text-[16px] sm:text-[17px] font-extrabold">
            ITEM
          </span>
          <p className="text-[18px] sm:text-xl font-extrabold">
            AT Rs.{product.price}
          </p>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10 ">
          <RippleButton
            className=" bg-white p-1.5 rounded-full"
            onClick={() =>
              isFavourite(product.id)
                ? removeFavouriteProduct()
                : addFavouriteProduct(product.id)
            }
          >
            <Heart
              className={`size-[18px] duration-150 ${heartColor} sm:size-6`}
            />
          </RippleButton>
        </div>

        <div
          onClick={() => navigate(`/${product?.collection}/${product?.id}`)}
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"
        ></div>
      </div>

      {/* Details Section */}
      <div
        onClick={() => navigate(`/${product?.collection}/${product?.id}`)}
        className="w-full  cursor-pointer flex flex-col items-start justify-start sm:gap-5 gap-3"
      >
        <div className="flex flex-col text-sm sm:text-lg items-start sm:gap-4 gap-2">
          <h1 className="sm:text-[22px] text-[16px] font-semibold">
            {product.name}
          </h1>
          <div className="flex  w-full items-center font-semibold gap-1 text-[12px] sm:text-[16px] ">
            <h1 className="flex items-start sm:gap-2 gap-0.5 justify-start ">
              <button className="p-1 white bg-green-700 rounded-full">
                {" "}
                <Icons.tomato className=" size-2.5 sm:size-5 fill-white text-white" />{" "}
              </button>
              ({productRating?.length?.toFixed(1)}{" "}
              {productRating && productRating?.length > 0 ? "+" : ""} )
            </h1>
            <p>{product?.cookingTime || "20mins - 50mins"}</p>
          </div>
        </div>
        <p className="text-[13px] line-clamp-2 md:line-clamp-4 sm:text-[18px] text-gray-400">
          {product?.description}
        </p>
      </div>

      {/* More Options Button */}
      <button
        className="absolute top-0 sm:top-9 right-2 text-[var(--dark-text)]  rounded-full"
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
          className="right-8 sm:right-12 flex text-white text-[12px] p-2 sm:text-[14px] flex-col items-start justify-start gap-1 top-4 "
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
