import { useNavigate, useParams } from "react-router-dom";
import {
  useAllProducts,
  useAppDispatch,
  useAppSelector,
  useFavourite,
  useRating,
} from "@/hooks";
import { Icons, toaster } from "@/utils";
import { PopularProduct } from "@/components";
import { useEffect, useRef, useState } from "react";
import { addToCart, removeCart } from "@/reducer";
import {
  addProductToCart,
  getPopularProducts,
  getProductById,
  removeProductFromCart,
} from "@/services";
import toast from "react-hot-toast";
import { ApiError, handleShare } from "@/helpers";
import ProductReview from "@/components/review/productReview";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorBoundary from "@/errorBoundary";
import { RippleButton } from "@/common";
import { ProductSkeleton } from "@/components/loader/product/productSkeleton";

export const ProductPage = () => {
  const { collection, productId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["single:product", productId],
    queryFn: () =>
      getProductById(
        productId as string,
        collection as Common.ProductCollection
      ),
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
    <ProductSkeleton />
  ) : (
    <div className="w-full relative    flex flex-col items-center justify-start gap-3">
      {/* product banner image */}
      <div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url(${import.meta.env.VITE_URI + "assets/" + data?.data?.data?.image
            })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className={`md:h-[60vh] ${isLoading ? `bg-gradient-to-r animate-pulse ` : ""
          } sm:h-[50vh] h-[45vh]  relative w-screen`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Top Left & Right Buttons */}
        <div className="absolute top-5 left-5 right-8 flex z-[10000] items-center justify-between ">
          <div onClick={() => navigate(-1)} className="size-5text-white cursor-pointer">
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
              onClick={() => handleShare(data?.data?.data?.name as string)}
              className="bg-[#ffffff36] hover:bg-[#f4f6f859] duration-150 text-white p-2.5 rounded-full"
            >
              <Icons.share className=" size-[18px] " />
            </RippleButton>
          </div>
        </div>
      </div>

      {/* product details */}
      <div className="w-full  z-[1]  mt-[-50px] md:mt-[-80px] px-3 sm:px-16 ">
        <div className=" w-full  gap-10  p-3 sm:px-10 sm:py-10 rounded-t-2xl flex flex-col items-center justify-center    bg-white">
          <ProductDetails {...(data?.data?.data as Ui.SpecialProducts)} />
          {/* Recommended Products */}
          {<RecommendProduct />}
          <ErrorBoundary>
            <ProductReview productId={productId as string} />
          </ErrorBoundary>

          {/* <Portal isOpen={openReview} onClose={() => setOpenReview(false)}>
            <div className="bg-white rounded-lg p-6 max-w-[90%] w-[500px] relative">
              <AddProductReview
                action="add" 
                openReview={openReview}
                setOpenReview={setOpenReview}
                productId={productId as string}
              />
            </div>
          </Portal> */}
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

  const recentCardReference = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full relative flex-col items-start justify-start gap-6">
      <h1 className="sm:text-[24px] text-[18px] font-semibold ">
        You might also like
      </h1>
      <div
        ref={recentCardReference}
        className="w-full  h-full overflow-y-hidden overflow-x-auto"
      >
        <div className=" w-max  flex  items-start justify-start gap-5">
          {products.map((product) => (
            <PopularProduct {...product} key={product.id} />
          ))}
        </div>

        {data?.data && data?.data?.length > 0 && (
          <>
            <button
              onClick={() => {
                recentCardReference.current?.scrollBy({
                  behavior: "smooth",
                  left: -300,
                });
              }}
              className=" p-2  absolute hover:bg-black/60 bg-black/50 -left-2 top-1/2 -translate-y-1/2 duration-150  text-white rounded-full "
            >
              <Icons.chevronLeft className=" text-white size-3.5 sm:size-5 " />
            </button>
            <button
              onClick={() => {
                recentCardReference.current?.scrollBy({
                  behavior: "smooth",
                  left: 300,
                });
              }}
              className="p-2 hover:bg-black/60 absolute bg-black/50 -right-2 top-1/2 -translate-y-1/2 duration-150  text-white rounded-full "
            >
              <Icons.chevronRight className="  size-3.5 sm:size-5 " />
            </button>
          </>
        )}
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
        await addProductToCart(auth?.userInfo?.uid as string, product?.id);
      }

      dispatch(addToCart({ ...product, quantity: 1 }));
    } catch (error) {
      if (error instanceof ApiError) {
        return toaster({
          title: error.message,
          icon: "error",
          className: "bg-red-50",
        });
      }
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

  const productById = cart?.products?.find(
    (pro) => pro?.id === product?.id
  ) as Ui.Product;

  const comments = data?.reduce(
    (count, review) => (review?.message ? count + 1 : count),
    0
  );

  useEffect(() => {
    productById && productById?.quantity > 0
      ? setHaveProductQuantity(true)
      : setHaveProductQuantity(false);
  }, [productById?.quantity]);

  const discountPrice = Math.round((product?.discount / 100) * product?.price)

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
          <p className="flex text-[13px] sm:text-[14px] text-green-700 font-semibold py-0.5 bg-green-100 rounded-full px-2  items-center justify-start gap-2">
            <Icons.tomato className="size-4 text-red-500 " />
            {data?.length.toFixed(1)}
          </p>
          <p className="flex   text-nowrap text-[13px] sm:text-[14px] text-[var(--secondary-text)]   py-0.5  rounded-full px-2  items-center justify-start gap-2">
            <Icons.comment className="size-4    " />
            {comments} reviews
          </p>
          <p className="flex text-[13px]  sm:text-nowrap text-[var(--secondary-text)]   py-0.5  rounded-full px-2  items-center justify-start gap-2">
            <Icons.clock className="size-4   " />
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
              Rs.{  !Number.isNaN(discountPrice) ? product?.price - discountPrice : product?.price}
            </p>
            {
              !Number.isNaN(discountPrice) && (
                <p className=" text-[var(--secondary-text)] text-[14px] md:text-[16px] mb-1  line-through ">
                  Rs.{product?.price}
                </p>
              )
            }
          </div>

          {haveProductQuantity ? (
            <div className="flex bg-[var(--primary-light)] p-1.5 rounded-full text-[14px]  items-center justify-center gap-3">
              <RippleButton
                onClick={() => {
                  productById && productById?.quantity > 1
                    ? dispatch(addToCart({ ...productById, quantity: -1 }))
                    : removeProduct(productById as Ui.Product);
                }}
                className="p-1.5 bg-[var(--primary-light)] rounded-full text-sm "
                children={<Icons.minus className=" size-3.5 text-white  " />}
              />
              <p className=" text-[20px] text-white ">
                {productById?.quantity || 0}
              </p>

              <RippleButton
                className="p-1.5  rounded-full bg-[var(--primary-light)] "
                onClick={() =>
                  dispatch(addToCart({ ...productById, quantity: 1 }))
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
        <p className=" text-[var(--secondary-text)] line-clamp-5 text-[16px] md:text-[16px] ">
          {product?.description}
        </p>
      </div>
    </div>
  );
};
