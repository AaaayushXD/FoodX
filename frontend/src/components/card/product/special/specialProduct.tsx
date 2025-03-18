
import { Icons } from "@/utils";
import { useNavigate } from "react-router-dom";

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

  return (
    <div
      onClick={() => navigate(`category/${product.tagId}/${product.id}`)}
      className=" md:min-w-[250px] flex flex-col items-start justify-start gap-1.5 sm:min-w-[200px] min-w-[200px]
    "
    >
      <div className="w-full relative h-full">
        <img
          src={product.image}
          className="w-full object-cover rounded-md md:h-[180px] h-[140px] "
          alt=""
        />
        <div className="flex absolute p-2  left-0  gap-0.5 bottom-0 bg-[var(--secondary-color)] rounded-tr-3xl  items-center justify-center ">
          <h1 className=" text-white font-extrabold text-[30px] sm:text-[35px] tracking-wider h-full leading-8 ">
            {product.discountPrice}
          </h1>
          <p className="flex flex-col text-white items-start gap-1 justify-center">
            <span className=" h-5 text-[16px] sm:text-[18px] font-bold ">
              %
            </span>
            <span className="sm:text-[14px] text-sm font-semibold ">Off</span>
          </p>
        </div>
      </div>
      <div className=" flex w-full items-end justify-between">
      <div className="flex text-[18px] w-full  flex-col items-start justify-center gap-1">
        <h2 className=" sm:text-lg text-[14px] font-bold ">{product.name}</h2>
        <div className="w-full flex items-center justify-start gap-6">
          <p className=" text-sm tracking-wide line-through text-red-700 ">
            Rs. {product.price}
          </p>
          <p className="sm:text-sm text-[14px] tracking-wide ">
            Rs. {product.price - product.discountPrice}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
          <span className=" flex items-center font-semibold justify-center gap-1 text-red-500">
            <Icons.tomato className="fill-red-500  " /> 49
          </span>
        </div>
      </div>
    </div>
  );
};
