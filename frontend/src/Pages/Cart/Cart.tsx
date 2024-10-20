import React, { useEffect, useState } from "react";
import { SingleCard } from "../../Components/Card/Card.Product.Cart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Reducer/product.reducer";

import toast from "react-hot-toast";
import { Product } from "../../models/product.model";
import {
  addProductToCart,
  getProductsOfCart,
} from "../../Services/cart.services";
import {
  getNormalProducts,
  getSpecialProducts,
} from "../../Services/product.services";
import { Loader } from "../../Components/Loader/Loader";

interface CardProp {
  action?: () => void;
}

const Cart: React.FC<CardProp> = ({ action }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const store = useSelector((state: RootState) => state.root);

  const navigate = useNavigate();
  const Total = () => {
    let total = 0;
    store?.cart?.products?.forEach(
      (singleProduct) => (total += singleProduct.price * singleProduct.quantity)
    );
    return total;
  };
  const dispatch = useDispatch<AppDispatch>();

  const addProductToCartFn = async (product: Product) => {
    const toastLoader = toast.loading("Loading...");

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

  const fetchProductsOfCartFn = async () => {
    setLoading(true);
    try {
      const response = (await getProductsOfCart(
        store?.auth?.userInfo?.uid as string
      )) as { products: string[] };
      const [normalProducts, specialsProducts] = [
        await getNormalProducts(),
        await getSpecialProducts(),
      ];
      const products = [
        ...normalProducts.data,
        ...specialsProducts.data,
      ] as Product[];
      const filterProducts = products?.filter((product) =>
        response.products.includes(product.id as string)
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
    } catch (error) {
      throw new Error("Error while fetching products of cart" + error);
    }
  };

  const addNewProductToCartFn = async () => {
    const productsId = store?.cart?.products?.map((product) => product.id);
    try {
      const fetchProductOfCart = await getProductsOfCart(
        store?.auth?.userInfo?.uid as string
      );
      const newProductsId = productsId?.filter(
        (id) => !fetchProductOfCart?.products.includes(id)
      );
      if (newProductsId.length > 0) {
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
      fetchProductsOfCartFn();
      addNewProductToCartFn();
    }
  }, [store?.auth?.userInfo.uid]);

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
      className="flex flex-col w-full justify-between h-full gap-3    sm:px-[0px]"
    >
      <div className="flex flex-col items-start ">
        <h3 className="w-full py-2 text-[25px] font-semibold tracking-wide text-[var(--dark-text)]">
          My Cart
        </h3>

        <div
          className={`flex flex-col relative h-[400px] items-center gap-2 w-full py-5 scrollbar-custom duration-200  pr-3 overflow-auto`}
        >
          {store?.cart?.products?.length > 0 ? (
            store?.cart?.products?.map((singleSelectedProduct) => (
              <SingleCard
                prop={singleSelectedProduct}
                key={singleSelectedProduct.id}
              />
            ))
          ) : (
            <div className="flex flex-col h-full   py-16 items-center justify-center gap-9">
              <ShoppingBag className=" text-[var(--dark-text)] cursor-pointer size-20" />

              <h1 className="text-[25px] tracking-wider text-[var(--dark-text)] ">
                Your cart is empty
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="flex border-t-[1px] border-[var(--dark-border)]    flex-col w-full gap-5">
        <div className="flex justify-between p-2  text-[var(--dark-text)]">
          <p className="text-lg font-semibold tracking-wider">Total Amount:</p>
          <p className="sm:text-[18px] text-[15px] ">
            Rs. <span>{Total()}</span>
          </p>
        </div>
        <button
          onClick={() => {
            action && action();
            setLoading(true);
            navigate("/cart/checkout");
          }}
          className="py-3 rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center hover:bg-[var(--primary-dark)]  text-white cursor-pointer tracking-wider text-xl font-bold"
        >
          Checkout
        </button>
        <Loader isLoading={loading} loadingFn={() => setLoading(false)} />
      </div>
    </div>
  );
};

export default Cart;
