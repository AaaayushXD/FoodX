import React, { useEffect } from "react";
import { SingleCard, TotalPay } from "@/components";
import { addToCart } from "@/reducer";
import toast from "react-hot-toast";
import { addProductToCart, getProductsOfCart } from "@/services";
import { useQuery } from "react-query";
import { useAllProducts, useAppDispatch, useAppSelector } from "@/hooks";
import { Icons, toaster } from "@/utils";
import { Empty } from "@/commons";

interface CardProp {
  action?: () => void;
}

export const Cart: React.FC<CardProp> = () => {
  const { data: products } = useAllProducts();
  const store = useAppSelector();
  const dispatch = useAppDispatch();

  const addProductToCartFn = async (product: Ui.Product) => {
    const toastLoader = toaster({
      title: "Please wait...",
      icon: "loading",
    });

    try {
      if (
        store?.auth?.userInfo?.uid &&
        !store?.cart?.products?.some((data) => data.id === product.id)
      ) {
        await addProductToCart(store?.auth.userInfo?.uid as string, product.id);
      }
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          tagId: product.tagId,
        })
      );
    } catch (error) {
      toast.error(error as string);
    }
    toast.dismiss(toastLoader);
  };

  const fetchProductsOfCartFn = async (): Promise<string[]> => {
    try {
      const response = await getProductsOfCart(
        store?.auth?.userInfo?.uid as string
      );
      return response.data?.products as string[];
    } catch (error) {
      throw new Error("Error while fetching products of cart" + error);
    }
  };

  const { data: productIdsInCart } = useQuery(
    "productsOfCart",
    fetchProductsOfCartFn,
    {
      enabled: store?.auth?.success && !store?.cart?.products,
    }
  );

  useEffect(() => {
    if (productIdsInCart) {
      const filterProducts = products?.filter((product) =>
        productIdsInCart.includes(product.id as string)
      );

      const isProductExist = filterProducts?.filter(
        (product) =>
          !store?.cart?.products.some((data) => product.id === data.id)
      );
      isProductExist?.forEach((product) => {
        dispatch(
          addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
            tagId: product.tagId,
          })
        );
      });
    }
  }, [productIdsInCart?.length]);

  const addNewProductToCartFn = async () => {
    const productsId = store?.cart?.products?.map((product) => product.id);
    try {
      const newProductsId = productsId?.filter(
        (id) => !productIdsInCart?.some((data) => data === id)
      );
      if (newProductsId && productIdsInCart && productIdsInCart?.length > 0) {
        newProductsId?.forEach(async (product) => {
          await addProductToCart(store?.auth?.userInfo?.uid as string, product);
        });
      }
    } catch (error) {
      throw new Error("Error while adding new Product id " + error);
    }
  };

  useEffect(() => {
    if (store?.auth?.success) {
      addNewProductToCartFn();
    }
  }, [store?.auth?.userInfo.uid, store?.cart.products, dispatch]);

  return (
    // Desktop
    <div
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        const productData = event.dataTransfer.getData("product");
        const product = JSON.parse(productData);
        addProductToCartFn(product);
      }}
      className="flex flex-col lg:max-w-lg w-full justify-between h-full gap-3"
    >
      <div className="flex flex-col items-start ">
        <h3 className="w-full py-4 sm:text-[25px] text-[18px] font-semibold tracking-wide text-[var(--dark-text)]">
          My Cart
        </h3>

        <div
          className={`flex flex-col relative  h-full pr-2 items-center gap-2 w-full py-5    overflow-auto`}
        >
          {store?.cart?.products?.length > 0 ? (
            store?.cart?.products?.map((singleSelectedProduct) => (
              <SingleCard
                prop={singleSelectedProduct}
                key={singleSelectedProduct.id}
              />
            ))
          ) : (
            <Empty
              title="Your cart is empty"
              icons={
                <Icons.shoppingBag className=" text-[var(--dark-text)] cursor-pointer sm:size-20 size-16" />
              }
            />
          )}
        </div>
      </div>
      <TotalPay />
    </div>
  );
};
