import { Minus, Plus, ShoppingCart } from "lucide-react";
import { addToCart } from "../../Reducer/product.reducer";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../Store";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../models/product.model";
import { addProductToCart } from "../../Services/cart.services";

interface MenuProp {
  prop: Product;
}

export const RecentProductCard: React.FC<MenuProp> = ({ prop }) => {
  const [activeCart, setActiveCart] = useState<boolean>();
  const [cartQuantity, setCartQuantity] = useState<number>(1);

  const store = useSelector((state: RootState) => state.root);

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = () => {
    if (cartQuantity > 1) {
      setCartQuantity((prev) => prev - 1);
      dispatch(
        addToCart({
          id: prop.id,
          quantity: -1,
        })
      );
    } else {
      setActiveCart(false); // Optionally handle removing the product
      dispatch(
        addToCart({
          id: prop.id,
          quantity: -1,
        })
      );
    }
  };

  useEffect(() => {
    const findQuantity = store?.cart?.products?.find(
      (singleProduct) => singleProduct.id === prop.id
    );
    if (findQuantity) {
      setCartQuantity(findQuantity.quantity);
    }
    if (findQuantity?.quantity === undefined || null) {
      setActiveCart(false);
    }
  }, [store?.cart?.products]);

  async function addProductFn(product: Product) {
    const isProductExistInCart = store?.cart?.products?.some(
      (data) => data.id === product.id
    );
    console.log(isProductExistInCart);
    try {
      if (!isProductExistInCart)
        await addProductToCart(
          store?.auth?.userInfo?.uid as string,
          product.id
        );
      setActiveCart((prevValue) => !prevValue);
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          tag: product.tag,
        })
      );
    } catch (error) {
      throw new Error("Error while adding product to cart " + error);
    }
  }

  return (
    <div className=" w-full shadow-sm sm:h-[110px] h-[100px] shadow-[var(--light-background)]  rounded-lg pr-4 flex items-center justify-between bg-[var(--light-foreground)]  ">
      <div className="flex items-stretch justify-start w-full h-full gap-3">
        <div className=" w-[120px]  sm:h-[110px] h-[110px]">
          <img
            src={prop.image}
            className=" w-[100px] sm:w-[120px] sm:h-full h-[100px] rounded-l-lg    "
          ></img>
        </div>
        <div className="flex flex-col items-start justify-center h-full gap-3">
          <p className="text-[var(--dark-text)] tracking-wide font-semibold  text-[15px] sm:text-[18px] w-full ">
            {prop.name?.length > 15
              ? prop.name.substring(0, 15) + "..."
              : prop.name}
          </p>
          <span className="sm:text-[18px] text-sm text-[var(--dark-secondary-text)] tracking-wide  ">
            Rs {prop.price}
          </span>
        </div>
      </div>

      <div
        className={`p-2   ${
          activeCart
            ? ""
            : "duration-200 cursor-pointer hover:bg-[var(--primary-color)] hover:text-[var(--light-text)]"
        }   bg-[var(--light-foreground)] rounded-full text-[var(--primary-color)]   shadow-sm flex justify-between items-center  right-1 border-[1px] border-[var(--dark-border)]  `}
      >
        {activeCart ? (
          <div className="flex items-center gap-2 px-1 text-xs select-none ">
            <button
              onClick={() => handleClick()}
              // disabled={cartQuantity <= 1 ? true : false}
            >
              <Minus
                className={`  sm:size-6 size-3 hover:text-[var(--secondary-color)]`}
                aria-disabled={"true"}
              />
            </button>

            <p className="px-1">{cartQuantity ? cartQuantity : "Add"}</p>
            <Plus
              className="  sm:size-6 size-3 cursor-pointer hover:text-[var(--secondary-color)]"
              onClick={() => {
                setCartQuantity((prevValue) => prevValue + 1);
                dispatch(
                  addToCart({
                    id: prop.id,
                    quantity: +1,
                  })
                );
              }}
            />
          </div>
        ) : (
          <button>
            <ShoppingCart
              className=" size-5 text-[var(--dark-text)] sm:size-6"
              onClick={() => {
                addProductFn({ ...prop });
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
};
