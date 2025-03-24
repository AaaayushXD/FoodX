import { useNavigate, useParams } from "react-router-dom";
import {
  useAllProducts,
  useAppDispatch,
  useAppSelector,
  useFavourite,
  useRating,
} from "@/hooks";
import { Icons, toaster } from "@/utils";
import { NotificationLoader, PopularProduct } from "@/components";
import { useEffect, useState } from "react";
import { addToCart, removeCart } from "@/reducer";
import { motion } from "framer-motion";
import {
  addProductToCart,
  getPopularProducts,
  getProductById,
  removeProductFromCart,
} from "@/services";
import toast from "react-hot-toast";
import { ApiError, handleShare, Styles } from "@/helpers";
import ProductReview from "@/components/review/productReview";
import React from "react";
import { AddProductReview } from "@/features";
import { useQuery } from "@tanstack/react-query";
import ErrorBoundary from "@/errorBoundary";
import { RippleButton } from "@/commons";

export const ProductPage = () => {
  const [openReview, setOpenReview] = React.useState<boolean>(false);
  const { collection, productId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["single:product", productId],
    queryFn: () =>
      getProductById(productId, collection as Common.ProductCollection),
    staleTime: 5 * 60 * 60,
    gcTime: 5 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled: !!productId,
  });

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

  const navigate = useNavigate();

  return isLoading ? (
    <NotificationLoader />
  ) : (
    <div className="w-full relative flex flex-col items-center justify-start gap-3">
      {/* product banner image */}
      <div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url(${data?.data?.data?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className={`md:h-[60vh] ${
          isLoading ? `bg-gradient-to-r animate-pulse ` : ""
        } sm:h-[50vh] h-[45vh]  relative w-screen`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Top Left & Right Buttons */}
        <div className="absolute top-5 left-5 right-8 flex items-center justify-between z-10">
          <div onClick={() => navigate(-1)} className="size-5 text-white">
            <Icons.arrowLeft />
          </div>
          <div className="flex items-center gap-8">
            <RippleButton
              onClick={() =>
                isFavourite(productId as string)
                  ? removeFavouriteProduct()
                  : addFavouriteProduct(productId as string)
              }
              className=" bg-[#ffffff36] hover:bg-[#f4f6f859] duration-150 text-white p-2.5 rounded-full "
            >
              <Icons.heart
                className={`size-[18px] duration-150  ${heartColor} `}
              />
            </RippleButton>
            <RippleButton
              onClick={() => handleShare(data?.data?.data?.name)}
              className="bg-[#ffffff36] hover:bg-[#f4f6f859] duration-150 text-white p-2.5 rounded-full"
            >
              <Icons.share className=" size-[18px] " />
            </RippleButton>
          </div>
        </div>
      </div>

      {/* product details */}
      <div className="w-full z-[1]  mt-[-50px] md:mt-[-80px] px-3 sm:px-16 ">
        <div className=" w-full  gap-10  p-3 sm:px-10 sm:py-10 rounded-t-2xl flex flex-col items-center justify-center    bg-white">
          <ProductDetails {...(data?.data?.data as Ui.SpecialProducts)} />
          {/* Recommended Products */}
          {<RecommendProduct />}
          <ErrorBoundary>
            <ProductReview productId={productId} />
          </ErrorBoundary>

          {openReview && (
            <AddProductReview
              action="add"
              openReview={openReview}
              setOpenReview={setOpenReview}
              productId={productId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const RecommendProduct = () => {
  const { isLoading, products: allProducts } = useAllProducts();

  const { data } = useQuery({
    queryKey: ["products:popular"],
    queryFn: getPopularProducts,
    staleTime: 5 * 60 * 60,
    gcTime: 5 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled: !isLoading,
  });

  const products = allProducts?.filter((product) =>
    data?.data?.some((pro) => pro.id === product.id)
  );

  return (
    <div className="flex w-full flex-col items-start justify-start gap-6">
      <h1 className="sm:text-[24px] text-[18px] font-semibold ">
        You might also like
      </h1>
      <div className="w-full overflow-auto">
        <div className=" w-max  flex  items-start justify-start gap-5">
          {products.map((product) => (
            <PopularProduct {...product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductDetails: React.FC<Ui.SpecialProducts> = (product) => {
  const [haveProductQuantity, setHaveProductQuantity] = useState<boolean>();
  const dispatch = useAppDispatch();
  const { auth, category: categories, cart } = useAppSelector();

  const { data } = useRating(product?.id);

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
  const category = categories?.categories?.find(
    (category) => category.id === product?.tagId
  );

  const productQuantity = cart?.products?.find(
    (pro) => pro.id === product?.id
  );

  const comments = data?.reduce(
    (count, review) => (review?.message ? count + 1 : count),
    0
  );

  useEffect(() => {
    productQuantity && productQuantity?.quantity > 0
      ? setHaveProductQuantity(true)
      : setHaveProductQuantity(false);
  }, [productQuantity?.quantity]);

  return (
    <div className="w-full flex items-start justify-start gap-5  flex-col">
      {/* Bottom Left Product Info */}
      <div className=" flex w-full  gap-2 flex-col items-start ">
        <p
          className="text-[12px] bg-blue-100 rounded-full px-2  border-blue-400 border text-blue-600 font-semibold flex items-center 
          justify-center sm:text-[12px] gap-1 text-[var(--dark-secondary-text)]"
        >
          {category?.name}
        </p>
        <h1 className="text-[20px] sm:text-2xl md:text-3xl font-bold ">
          {product.name}
        </h1>
        <div className="flex items-center justify-start gap-2  ">
          <p className="flex text-[14px] text-green-700 font-semibold py-0.5 bg-green-100 rounded-full px-2  items-center justify-start gap-2">
            <Icons.tomato className="size-4 text-red-500 " />
            {data?.length.toFixed(1)}
          </p>
          <p className="flex text-[14px] text-[var(--secondary-text)]   py-0.5  rounded-full px-2  items-center justify-start gap-2">
            <Icons.comment className="size-4    " />
            {comments} reviews
          </p>
          <p className="flex text-[14px] text-[var(--secondary-text)]   py-0.5  rounded-full px-2  items-center justify-start gap-2">
            <Icons.clock className="size-4    " />
            {product?.cookingTime}
          </p>
        </div>
      </div>
      {/* Product Details */}
      <div className={`flex w-full flex-col items-start justify-start gap-4`}>
        {/* Ratings & Cart Button */}
        <div className="w-full flex  mt-4 flex-wrap gap-4 items-center justify-between text-sm">
          <div className="flex flex-col sm:flex-row sm:items-end items-start justify-start   h-full  sm:gap-3">
            <p className=" sm:text-2xl text-xl md:text-3xl text-[var(--primary-light)] font-bold ">
              Rs.{product?.price}
            </p>
            <p className=" text-[var(--secondary-text)] text-[14px] md:text-[16px] mb-1  line-through ">
              {product?.discountPrice && "Rs." + product?.discountPrice} Rs.100
            </p>
          </div>

          {haveProductQuantity ? (
            <div className="flex bg-[var(--primary-light)] p-1.5 rounded-full text-[14px]  items-center justify-center gap-3">
              <RippleButton
                onClick={() => {
                  productQuantity && productQuantity?.quantity > 1
                    ? dispatch(addToCart({ ...productQuantity, quantity: -1 }))
                    : removeProduct(productQuantity as Ui.Product);
                }}
                className="p-1.5 bg-[var(--primary-light)] rounded-full text-sm "
                children={<Icons.minus className=" size-3.5 text-white  " />}
              />
              <p className=" text-[20px] text-white ">{productQuantity?.quantity|| 0}</p>

              <RippleButton
                className="p-1.5  rounded-full bg-[var(--primary-light)] "
                onClick={() =>
                  dispatch(addToCart({ ...productQuantity, quantity: 1 }))
                }
                hover="red"
                aria-label="Increase quantity"
              >
                <Icons.plus className="size-3 text-white " />
              </RippleButton>
            </div>
          ) : (
            <RippleButton
              className=""
              color="red"
              onClick={() => handleProduct(product)}
            >
              <Icons.addToCart />
            </RippleButton>
          )}
        </div>
      </div>
      <div
        className="flex flex-col items-start justify-start gap-0.5
         "
      >
        <h1 className=" text-lg  ">Details</h1>
        <p className=" text-[var(--secondary-text)] text-[16px] md:text-[16px] ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt a
          corporis quo odio doloribus cupiditate praesentium voluptatibus quasi
          perferendis! Minus ea sunt repellat?
        </p>
      </div>
    </div>
  );
};
