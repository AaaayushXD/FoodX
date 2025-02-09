import { useAppDispatch, useAppSelector } from "../../hooks/useActions";
import { addToCart, removeCart } from "../../reducer/product.reducer";

import { removeProductFromCart } from "../../services/cart.services";
import toast from "react-hot-toast";
import { Icons } from "../../utils";

interface SingleCardProp {
  prop: Ui.Product;
}

export const SingleCard: React.FC<SingleCardProp> = ({
  prop,
}: SingleCardProp) => {
  // const [InitialQuantity, setInitialQuantity] = useState<number>(1);
  const dispatch = useAppDispatch();
  const store = useAppSelector();

  const removeProductFromCartFn = async (productId: string) => {
    const toastLoader = toast.loading("Loading...");
    try {
      if (store?.auth?.success) {
        await removeProductFromCart(
          store?.auth?.userInfo?.uid as string,
          productId
        );
      }
      dispatch(removeCart(prop.id));
    } catch (error) {
      toast.error(error as string);
    }
    toast.dismiss(toastLoader);
  };

  return (
    <div
      key={prop.id}
      className={`duration-1000 h-[90px]  sm:h-[110px] border border-[var(--dark-border)]    group/cart relative flex gap-3 items-center  w-full bg-[var(--light-foreground)] rounded-md `}
    >
      <div className="  sm:w-[120px] w-[100px]  h-full  ">
        <img
          className="w-full h-full  object-cover shrink-0 object-center rounded-l-lg"
          src={prop.image}
          alt=""
        />
      </div>
      <div className="flex flex-col py-1.5  gap-2 px-3 justfy-between">
        <p className="sm:text-[18px] text-[14px]  pt-1 text-[var(--dark-text)] font-bold tracking-wide">
          {prop.name.length > 18
            ? prop.name.substring(0, 15) + "..."
            : prop.name}
        </p>
        <p className="text-[12px] text-[var(--dark-secondary-text)] ">
          Rs {prop.price}
        </p>
        <div className="flex gap-[40px]   items-center ">
          <div className="flex sm:gap-3 gap-1 text-md text-[var(--primary-color)]">
            <button
              onClick={() => {
                if (prop.quantity <= 1) {
                  removeProductFromCartFn(prop.id);
                } else {
                  dispatch(
                    addToCart({
                      id: prop.id,
                      quantity: -1,
                    })
                  );
                }
              }}
              className=" flex items-center justify-center  text-[10px] font-bold text-lg   w-[25px] py-[4px] px-[6px] rounded-full  text-center hover:bg-[var(--primary-color)] hover:text-[var(--light-text)]"
            >
              -
            </button>
            <p className="text-sm rounded-full flex justify-center items-center   ">
              {" "}
              {prop.quantity}
            </p>
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: prop.id,
                    quantity: +1,
                  })
                )
              }
              className="  justify-center flex items-center text-[10px] text-lg   font-bold  py-[4px] px-[6px] rounded-full  text-center hover:bg-[var(--primary-color)] hover:text-[var(--light-text)]"
            >
              +
            </button>
          </div>
          <p className=" sm:text-sm text-[11px]  flex text-[var(--dark-secondary-text)] w-full items-center justify-center  px-[3px] py-[2px] rounded-sm">
            {" "}
            {prop.quantity} × {prop.price}
          </p>
        </div>
      </div>
      <div
        onClick={() => {
          removeProductFromCartFn(prop.id);
        }}
        className=" cursor-pointer duration-150 absolute px-2 sm:px-3 bg-[#B32624] h-full  justify-center items-center right-0 flex rounded-tr-md  rounded-br-md invisible group-hover/cart:visible opacity-0 group-hover/cart:opacity-[1] "
      >
        <Icons.delete className="text-white sm:size-6 size-5 " />
      </div>
    </div>
  );
};
