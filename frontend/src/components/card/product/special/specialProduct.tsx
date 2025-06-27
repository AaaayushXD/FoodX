import { Icons } from "@/utils";
import { useNavigate } from "react-router-dom";
import Img from "@/assets/placeholder.svg";
import { Image } from "@/helpers";

export const SpecialProduct: React.FC<Ui.SpecialProducts> = (product) => {
  // const [activeCart, setActiveCart] = useState<boolean>(false);
  // const [cartQuantity, setCartQuantity] = useState<number>(1);

  // const handleClick = () => {
  //   if (cartQuantity == 1) {
  //     setActiveCart(!activeCart);
  //   }
  //   setCartQuantity((prev) => (prev <= 1 ? 1 : prev - 1));
  // };

  // const addProductToCartFn = async () => {
  //   try {
  //     setActiveCart((prevValue) => !prevValue);
  //   } catch (error) {
  //     toast.error(error as string);
  //   }
  // };

  const navigate = useNavigate();


    const discountPrice =  Math.round((product?.discount/100)*product?.price)

  return (
    <div
      onClick={() => navigate(`${product?.collection}/${product?.id}`)}
      className=" cursor-pointer sm:min-w-[250px] min-w-[210px] flex flex-col items-start justify-start gap-1.5 
    "
    >
      <div className="w-full relative h-full">
        <Image
          highResSrc={import.meta.env.VITE_URI + "assets/" + product?.image}
          lowResSrc={Img}
          className="w-full object-cover rounded-md md:h-[180px] h-[140px] "
          alt=""
        />
        <div className="flex absolute p-2  left-0  gap-0.5 bottom-0 bg-[var(--secondary-color)] rounded-tr-3xl  items-center justify-center ">
          <h1 className=" text-white font-extrabold text-[30px] sm:text-[35px] tracking-wider h-full leading-8 ">
            {product?.discount}
          </h1>
          <p className="flex flex-col text-white items-start gap-1 justify-center">
            <span className=" h-5 text-[16px] sm:text-[18px] font-bold ">
              %
            </span>
            <span className="sm:text-[14px] text-sm font-semibold ">Off</span>
          </p>
        </div>
      </div>
      <div className=" w-full flex items-center  ">
        <div className="flex text-[18px] w-full   flex-col items-start justify-center">
          <h2 className=" sm:text-[16px] text-[14px] text-[var(--secondary-text)] ">
            {product?.name}
          </h2>
          <div className="w-full flex items-center justify-start gap-2 sm:gap-3">
            <p className="sm:text-lg font-semibold text-[var(--primary-dark)] text-[14px] tracking-wide ">
              Rs. {product?.price-discountPrice}
            </p>
            {discountPrice !== 0 && (
              <p className="sm:text-sm text-[12px] tracking-wide line-through text-red-700 ">
                Rs. {product?.price}
              </p>
            )}
          </div>
        </div>
        <div className="flex  relative  flex-col items-end">
          <span className=" flex items-center font-semibold justify-between gap-1 text-red-500">
            <Icons.tomato className="fill-red-500  " /> {product?.rating}
          </span>
          <p className="invisible">fdsj</p>
          <p className=" absolute text-[12px] bottom-[6px] sm:bottom-0 sm:text-[14px] text-[var(--secondary-text)] w-[108px] text-end  ">
            {product?.cookingTime}
          </p>
        </div>
      </div>
    </div>
  );
};
