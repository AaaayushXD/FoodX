
import toast from "react-hot-toast";
import { removeFavourite } from "@/reducer";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { removeFavourites } from "@/services";
import { Icons } from "@/utils";

interface SingleCardProp {
  prop: Ui.Product;
}

export const FavouriteCard: React.FC<SingleCardProp> = ({
  prop,
}: SingleCardProp) => {
  const dispatch = useAppDispatch()

  const {auth} = useAppSelector()

  const removeFavouriteProduct = async (id: string) => {
    const toastId = toast.loading("Removing from favorites...");
    try {
      await removeFavourites({
        uid: auth?.userInfo?.uid as string,
        productId: id,
      });
      toast.dismiss(toastId);
      toast.success("Item removed from the cart successfully!");
      dispatch(removeFavourite(id));
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to remove the item. Please try again.");
      throw new Error("Error while removing favourite cart product" + error);
    }
  };

  return (
    <div
      key={prop.id}
      className={`duration-1000 cursor-pointer  border-[1px] border-[var(--dark-border)]    group/cart relative flex gap-3 items-center h-[90px] sm:h-[120px] w-full bg-[var(--light-foreground)] rounded-lg `}
    >
      <div>
        <img
          className="sm:w-[120px] w-[100px] h-[87px]  sm:h-[120px] object-cover shrink-0 object-center rounded-l-lg"
          src={prop.image}
          alt=""
        />
      </div>
      <div className="flex h-full  flex-col gap-2 px-3 items-start justify-evenly ">
        <p className="sm:text-[18px] text-[14px]  text-[var(--dark-text)] font-semibold tracking-wide">
          {prop.name}
        </p>
        <p className="text-[12px]  text-[var(--dark-secondary-text)] ">
          Rs {prop.price}
        </p>
      </div>
      <div
        onClick={() => removeFavouriteProduct(prop.id)}
        className=" cursor-pointer duration-150 absolute px-2 sm:px-3 bg-[#B32624] h-full  justify-center items-center right-0 flex rounded-tr-md  rounded-br-md invisible group-hover/cart:visible opacity-0 group-hover/cart:opacity-[1] "
      >
        <Icons.delete className="text-white sm:size-6 size-5 " />
      </div>
    </div>
  );
};
