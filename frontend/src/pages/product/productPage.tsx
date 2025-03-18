import { useNavigate, useParams } from "react-router-dom";
import {
  specialProducts,
  useAllProducts,
  useAppDispatch,
  useAppSelector,
  useFavourite,
} from "@/hooks";
import { Icons, toaster } from "@/utils";
import { CategoryProduct } from "@/components";
import { useEffect, useState } from "react";
import { addToCart, removeCart } from "@/reducer";
import { motion } from "framer-motion";
import {
  addProductToCart,
  getProductById,
  removeProductFromCart,
} from "@/services";
import toast from "react-hot-toast";
import { ApiError, handleShare, Styles } from "@/helpers";
import ProductReview from "@/components/review/productReview";
import React from "react";
import { AddProductReview } from "@/features";
import { useQuery } from "react-query";

export const ProductPage = () => {
  const [haveProductQuantity, setHaveProductQuantity] = useState<boolean>();
  const [openReview, setOpenReview] = React.useState<boolean>(false);
  const { collection, productId } = useParams();

  const dispatch = useAppDispatch();
  const { cart, auth, category: categories } = useAppSelector();

  const { data, isLoading, isError, error } = useQuery(
    ["single:product", productId],
    {
      queryFn: () =>
        getProductById(productId, collection as Common.ProductCollection),
      staleTime: 5 * 60 * 60,
      cacheTime: 5 * 60 * 60,
      refetchOnWindowFocus: false,
      enabled: !!productId,
      onError: (err) => {
        console.log(err);
      },
    }
  );

  if (isError || error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }

  const {
    addFavouriteProduct,
    isFavourite,
    heartColor,
    removeFavouriteProduct,
  } = useFavourite(productId as string);

  const productQuantity = cart?.products?.find(
    (product) => product.id === productId
  );

  useEffect(() => {
    productQuantity && productQuantity?.quantity > 0
      ? setHaveProductQuantity(true)
      : setHaveProductQuantity(false);
  }, [productQuantity?.quantity]);

  const navigate = useNavigate();

  async function handleProduct(product: Ui.Product) {
    const loading = toaster({
      title: "Please wait...",
      icon: "loading",
    });
    try {
      if (auth.success) {
        const response = await addProductToCart(
          auth?.userInfo?.uid as string,
          product?.id
        );
      }

      dispatch(addToCart({ ...product, quantity: 1 }));
    } catch (error) {
      throw new Error("Error while adding product to cart " + error);
    } finally {
      toast.dismiss(loading);
    }
  }

  async function removeProduct(product: Ui.Product) {
    const loading = toaster({
      title: "Please wait...",
      icon: "loading",
    });

    if (auth.success) {
      const response = await removeProductFromCart(
        auth.userInfo?.uid,
        product.id
      );
      if (response instanceof ApiError) {
        toast.dismiss(loading);
        return toaster({
          title: response?.message,
          icon: "error",
        });
      }
    }

    setHaveProductQuantity(false);
    dispatch(removeCart(product.id));
    toast.dismiss(loading);
  }
  const category = categories.categories.find(
    (category) => category.id === data?.data?.data?.tagId
  );

  return (
    <div className="w-full flex flex-col items-start justify-start gap-3">
      <div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)), url(${data?.data?.data?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className={`md:h-[60vh] ${
          isLoading ? `bg-gradient-to-r animate-pulse ` : ""
        } sm:h-[50vh] h-[45vh] relative w-full`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Bottom Left Product Info */}
        <div className="absolute bottom-5 left-2 flex flex-col items-start z-10">
          <h1 className="text-[20px] sm:text-[22px] font-bold text-white">
            {data?.data?.data?.name}
          </h1>
          <p
            className="text-[14px] flex items-center 
          justify-center sm:text-[16px] gap-1 text-[var(--dark-secondary-text)]"
          >
            {category?.name}
            <div className="h-3 bg-[var(--dark-secondary-text)] w-0.5"></div>
            <span>{data?.data?.data?.cookingTime || "30mins - 40mins"}</span>
          </p>
        </div>

        {/* Top Left & Right Buttons */}
        <div className="absolute top-5 left-5 right-8 flex items-center justify-between z-10">
          <button onClick={() => navigate(-1)} className="size-5 text-white">
            <Icons.arrowLeft />
          </button>
          <div className="flex items-center gap-8">
            <button
              onClick={() =>
                isFavourite(productId as string)
                  ? removeFavouriteProduct()
                  : addFavouriteProduct(productId as string)
              }
              className="text-white size-5"
            >
              <Icons.heart className={`size-6 duration-150 sm:size-7 ${heartColor} `} />
            </button>
            <button
              onClick={() => handleShare(data?.data?.data?.name)}
              className="text-white size-5"
            >
              <Icons.share className=" size-6 sm:size-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div
        className={`flex w-full ${
          isLoading ? ` animate-pulse   p-2 ` : ""
        } flex-col items-start justify-start gap-4 px-2`}
      >
        <p className="text-[16px] sm:text-[18px] text-[var(--dark-text)]">
          {data?.data?.data?.description}
        </p>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-[var(--dark-secondary-text)]  flex items-center">
            <Icons.tomato className="text-[var(--dark-border)] fill-red-500 size-5 sm:size-7" />
            <span className="text-sm sm:text-[16px] ml-1">
              (4.5)1.9k reviews
            </span>
          </span>{" "}
          <span className="w-0.5 h-2.5 mt-0.5 bg-slate-400 "></span>
          <span
            onClick={() => setOpenReview(!openReview)}
            className=" text-xs mt-0.5 text-gray-500 cursor-pointer hover:underline "
          >
            Write a review
          </span>
        </div>

        {/* Ratings & Cart Button */}
        <div className="w-full flex  flex-wrap gap-4 items-center justify-between text-sm">
          <p className=" text-[18px] font-bold ">
            Rs.{data?.data?.data?.price}
          </p>

          {haveProductQuantity ? (
            <div className="flex border-[1px] font-bold text-[16px] text-green-600  rounded-lg shadow items-center justify-center gap-3">
              <motion.button
                className="p-2"
                onClick={() => {
                  productQuantity && productQuantity?.quantity > 1
                    ? dispatch(addToCart({ ...productQuantity, quantity: -1 }))
                    : removeProduct(productQuantity as Ui.Product);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Decrease quantity"
              >
                <Icons.minus className="size-5" />
              </motion.button>

              <motion.p
                className="text-[16px]  scale-[1.3] "
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {productQuantity?.quantity || 0}
              </motion.p>

              <motion.button
                className="p-2"
                onClick={() =>
                  dispatch(addToCart({ ...productQuantity, quantity: 1 }))
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Increase quantity"
              >
                <Icons.plus className="size-5" />
              </motion.button>
            </div>
          ) : (
            <button onClick={() => handleProduct(data?.data.data)}>
              <Icons.addToCart />
            </button>
          )}
        </div>
      </div>
      <ProductReview />
      {/* Recommended Products */}
      <RecommendProduct />
      {openReview && (
        <AddProductReview
          action="add"
          openReview={openReview}
          setOpenReview={setOpenReview}
          productId={productId}
        />
      )}
    </div>
  );
};

const RecommendProduct = () => {
  const { data } = specialProducts();
  return (
    <div className="flex w-full px-2 border-[1px] border-[var(--dark-border)] py-5 flex-col items-start justify-start gap-5">
      <h1 className="text-lg font-bold ">Related Products</h1>
      <div className="w-full flex flex-col items-start justify-start gap-5">
        {data?.map((product) => (
          <CategoryProduct {...product} key={product.id} />
        ))}
      </div>
    </div>
  );
};
