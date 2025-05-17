import { useAppDispatch, useAppSelector } from "@/hooks/useActions";
import { addToCart, removeCart } from "@/reducer";
import Img from "@/assets/placeholder.svg";
import { removeProductFromCart } from "@/services";
import toast from "react-hot-toast";
import { Icons, toaster } from "../../../utils";
import { ApiError, Image } from "@/helpers";
import { RippleButton } from "@/commons";

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
    const toastLoader = toaster({
      icon: "loading",
      title: "Please wait...",
    });
    try {
      if (store?.auth?.success) {
        await removeProductFromCart(
          store?.auth?.userInfo?.uid as string,
          productId
        );
      }
      dispatch(removeCart(prop.id));
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          icon: "error",
          message: error?.message,
          className: "bg-red-50",
        });
      }
    } finally {
      toast.dismiss(toastLoader);
    }
  };

  return (
    <div
      key={prop.id}
      className={`duration-1000 h-[90px]  sm:h-[110px] border border-[var(--dark-border)]    group/cart relative flex gap-3 items-center  w-full bg-[var(--light-foreground)] rounded-md `}
    >
      <div className="w-full flex items-center justify-start h-full">
        <div className="  sm:w-[120px] w-[100px]  h-full  ">
          <Image
            lowResSrc={Img}
            className="w-full h-full  object-cover shrink-0 object-center rounded-l-lg"
            highResSrc={ import.meta.env.VITE_URI + "assets/" + prop?.image}
            alt="image"
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
          <div className="flex items-center ">
            <div className="flex items-center justify-start gap-2 text-[var(--primary-color)]">
              <RippleButton
                onClick={() => {
                  if (prop.quantity <= 1) {
                    removeProductFromCartFn(prop.id);
                  } else {
                    dispatch(
                      addToCart({
                        id: prop.id,
                        quantity: -1,
                        image: prop.image,
                        name: prop.name,
                        price: prop.price,
                      })
                    );
                  }
                }}
                className=" flex items-center justify-center  text-[10px] font-bold text-lg p-1 rounded-full  text-center hover:bg-[var(--primary-color)] hover:text-[var(--light-text)]"
              >
                <Icons.minus className=" size-3 " />
              </RippleButton>
              <p className="text-sm   ">{prop.quantity}</p>
              <RippleButton
                onClick={() =>
                  dispatch(
                    addToCart({
                      ...prop,
                      quantity: +1,
                    })
                  )
                }
                className=" justify-center flex items-center text-[10px] text-lg p-1   font-bold   rounded-full  text-center hover:bg-[var(--primary-color)] hover:text-[var(--light-text)]"
              >
                <Icons.plus className=" size-3 " />
              </RippleButton>
            </div>
            <p className=" sm:text-sm text-[11px]  flex text-[var(--dark-secondary-text)] w-full items-center justify-center  px-[3px] py-[2px] rounded-sm">
              {" "}
              {prop.quantity} × {prop.price}
            </p>
          </div>
        </div>
      </div>
      <RippleButton
        onClick={() => {
          removeProductFromCartFn(prop.id);
        }}
        className=" cursor-pointer duration-150 absolute px-2 sm:px-3 bg-[#B32624] h-full  justify-center items-center right-0 flex rounded-tr-md  rounded-br-md invisible group-hover/cart:visible opacity-0 group-hover/cart:opacity-[1] "
      >
        <Icons.delete className="text-white sm:size-6 size-5 " />
      </RippleButton>
    </div>
  );
};
