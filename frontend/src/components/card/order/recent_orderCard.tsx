import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useActions";
import { addProductToCart, removeProductFromCart } from "@/services";
import { removeCart, addToCart } from "@/reducer";
import { Icons } from "@/utils";
import { Image } from "@/helpers";
import defaultImage from "@/assets/placeholder.svg";

interface RecentCardProp {
  item: Model.UserOrder;
}

export const RecentCard: React.FC<RecentCardProp> = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const store = useAppSelector();
 
  async function handleAdd() {
    store?.cart?.products?.forEach(async (product) => {
      await removeProductFromCart(
        store?.auth?.userInfo?.uid as string,
        product.id
      );
      dispatch(removeCart(product?.id));
    });
    item.products?.forEach(async (product) => {
      await addProductToCart(store?.auth?.userInfo?.uid as string, product.id);
      dispatch(addToCart({ ...product }));
    });

    navigate("/checkout");
  }


  return (
    <div className="sm:w-[350px]  bg-[var(--light-foreground)] rounded-l-lg h-full border-[1px] border-[var(--dark-border)] rounded-lg flex items-center justify-center">
      <div className="sm:w-[300px] h-[150px] w-[200px] rounded-l-lg     ">
        <Image
          highResSrc={ import.meta.env.VITE_URI + "assets/" + item?.products[0]?.image}
          className=" rounded-l-lg w-full h-full object-cover  "
          lowResSrc={defaultImage}
        ></Image>
      </div>
      <div className="flex py-3 flex-col w-full items-start gap-2 justify-between h-full">
        <p className="sm:text-[14px] px-2 text-xs text-gray-400 ">
          #{item?.id?.slice(0, 10)}{" "}
        </p>
        <div className="w-full px-2 flex items-center justify-between">
          <p className="text-[var(--dark-secondary-text)] tracking-wider font-semibold gap-4 text-sm sm:text-[14px] ">
            {item?.time?.split(" ")[0]}
          </p>
          <p className="text-[var(--dark-secondary-text)] tracking-wider font-semibold gap-4 text-sm sm:text-[14px] ">
            {item?.time?.split(" ")[1]} {item?.time?.split(" ")[2]}
          </p>
        </div>
        <div className="pb-5 px-2 text-sm sm:text-[12px]  font-semibold w-full text-gray-500 border-dotted border-b-[1.2px] line-clamp-1">
          {item?.products?.map(
            (product) => `• ${product?.name} (${product?.quantity}) `
          )}
        </div>

        <div className="flex px-2  items-center justify-between w-full">
          <span className=" font-semibold text-[var(--dark-text)] text-sm sm:text-[16px] tracking-wider ">
            Rs.{item?.amount}
          </span>
          <button
            onClick={() => handleAdd()}
            className=" font-semibold duration-150  flex items-center justify-start text-[var(--primary-color)] text-[14px] sm:text-[16px] hover:text-[var(--primary-light)] "
          >
            Order <Icons.redo className="size-4 sm:size-5" />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
