import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services";
import { FoodCategory } from "./food";
import { ApiError, Skeleton } from "@/helpers";
import { toaster } from "@/utils";
import { Empty, Error } from "@/commons";
import EmptyImage from "@/assets/EmptyOrder.png";
import { useAppDispatch } from "@/hooks";
import { addCategory } from "@/reducer";

export interface categoriesTagOption {
  name: string;
  id?: string;
  image: string;
}

export const MenuType: React.FC = () => {
  const dispatch = useAppDispatch();
  const CategoriesData = async (): Promise<Ui.Category[]> => {
    // setLoading(true);
    try {
      const response = await getCategories();
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50",
          icon: "error",
          message: error?.message,
        });
      }
      throw new ApiError(400)
    }
  };

  const { data, isLoading, error, refetch, isError, isSuccess } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoriesData,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      dispatch(addCategory(data));
    }
  }, [isLoading, isSuccess]);

  return (
    <div className="flex flex-col items-center w-full gap-6 ">
      <div className="flex items-center justify-start w-full ">
        <p className=" text-center font-[600] sm:text-[22px] text-[13px] sm:min-w-[248px] w-[280px] tracking-wide text-[var(--dark-text)]">
          WHAT'S ON YOUR MIND?
        </p>
        <h3 className="h-[1px] w-full  bg-gradient-to-r from-black/0 dark:from-white/0 to-black/100 dark:to-white/100"></h3>
      </div>

      {isLoading ? (
        <Skeleton
          parent={{
            style: {
              gridTemplateColumns: `repeat(${Math?.round(
                10 / 2
              )}, minmax(0,1fr) ) `,
            },
          }}
          count={10}
          children={{
            className: "  sm:max-w-[100px] size-14 sm:h-[100px] rounded-full ",
          }}
          className="w-full h-full  grid gap-5 "
        />
      ) : isError ? (
        <Error
          title={
            error instanceof ApiError ? error?.message : "Something went wrong"
          }
          button={{
            title: "Refresh",
            onClick: () => refetch(),
          }}
        />
      ) : data && data?.length <= 0 ? (
        <Empty title="No categories available" image={EmptyImage} />
      ) : (
        <div className="flex items-center justify-start flex-nowrap w-full gap-5 sm:gap-4 overflow-auto">
          <FoodCategory menu={data as Ui.Category[]} />
        </div>
      )}
    </div>
  );
};

// export const FoodCategory: React.FC<FoodCategoryProp> = ({
//   prop,
//   color,
//   action,
// }) => {
//   // const { colors,dominantColor,error, loading } = useExtractColors(prop.image);

//   // async function getColors(image: string) {
//   //    const {colors,darkerColor, dominantColor, error,lighterColor,loading} = await useExtractColors(image)
//   //    return {colors, darkerColor, dominantColor, error, lighterColor, loading}
//   // }

//   //  const {} = getColors(prop.image)

//   return (
//     <div
//       onClick={() => action({ ...prop })}
//       className="w-full min-w-[120px] h-[140px]  sm:min-w-[180px] cursor-pointer rounded-xl overflow-hidden relative sm:h-[240px] z-30"
//       key={prop.id}
//     >
//       <div
//         style={{
//           background: color.backgroundColor,
//         }}
//         className="w-full bg-slate-300 hover:opacity-[0.9] duration-150 absolute z-[2] h-full"
//       >
//         <div className="flex -bottom-5 items-end h-full w-full z-[-1] rounded-xl justify-end overflow-hidden absolute -right-8   ">
//           <img
//             className="sm:w-[260px] w-[240px] scale-[0.9] sm:scale-[1.05] h-[110px] sm:h-[180px] rounded-3xl"
//             src={prop.image}
//             alt={prop.name}
//           />
//         </div>
//         <h1
//           style={{ color: color.textColor }}
//           className="absolute top-7 left-4 tracking-wider text-[13px] sm:text-[17px]  font-semibold "
//         >
//           {prop.name}
//         </h1>
//       </div>
//     </div>
//   );
// };

// <div className="flex flex-wrap items-center justify-center w-full gap-8 sm:gap-20 sm:justify-evenly lg:justify-start">
// {isLoading || !loading ? (
//   initialData?.length <= 0 ? (
//     <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
//       <img
//         src={Empty}
//         alt="No orders found"
//         className="mb-4 size-40"
//       />
//       <h4 className="text-xl text-[var(--dark-secondary-text)] mb-2">
//         No products found
//       </h4>
//       <p className="text-sm text-[var(--dark-secondary-text)] mb-4">
//         Try browsing other categories for more options.
//       </p>
//     </div>
//   ) : (
//     initialData?.map((singleObject, index) => (
//       <SpecialCards style={true} prop={singleObject} key={index} />
//     ))
//   )
// ) : (
//   <div className="flex w-full gap-4 ">
//     <Skeleton
//       className="flex w-full h-full"
//       containerClassName="lg:w-[1400px] lg:min-w-[1300px] lg:h-[200px] sm:flex overflow-auto   gap-2 lg:w-[280px] sm:w-[800px] w-[900px] h-[120px] sm:h-[160px]"
//       baseColor="var(--light-background)"
//       highlightColor="var(--light-foreground)"
//       count={4}
//     />
//   </div>
// )}
// </div>

{
  /* <div className="flex  w-full flex-col items-start rounded-md bg-[var(--light-foreground)]  gap-5  py-5">
        <p className="sm:text-2xl text-[16px]  pt-4 text-[var(--dark-text)] font-bold tracking-wider">
          {initialTag?.name.charAt(0).toUpperCase() + initialTag?.name.slice(1)}
        </p>


      </div> */
}

// const [initialData, setInitialData] = useState<Ui.Product[]>([]);

// const getMenuProducts = async () => {
//   setLoading(true);
//   try {
//     const response = await getProductsByTag(initialTag?.id as string);

//     const aggregateSpecialData = specials?.filter(
//       (product: Ui.Product) => product?.tagId === initialTag?.id
//     );

//     setInitialData([
//       ...response.data,
//       ...(aggregateSpecialData as Ui.Product[]),
//     ]);
//   } catch (error) {
//     throw new Error("Error while getting products by tag" + error);
//   }
//   setLoading(false);
// };

// useEffect(() => {
//   if (!isLoading && specials && specials?.length > 0) {
//     getMenuProducts();
//   }
// }, [initialTag?.id, specials]);

// const gradientColorPalette = [
//   "linear-gradient(135deg, rgba(255, 223, 186, 0.8), rgba(255, 150, 100, 0.8))", // Gradient for Pizza
//   "linear-gradient(135deg, rgba(255, 240, 207, 0.8), rgba(255, 200, 140, 0.8))", // Gradient for Burger
//   "linear-gradient(135deg, rgba(255, 235, 205, 0.8), rgba(255, 180, 90, 0.8))", // Gradient for Biryani
//   "linear-gradient(135deg, rgba(240, 248, 255, 0.8), rgba(130, 200, 255, 0.8))", // Gradient for Asian
//   "linear-gradient(135deg, rgba(255, 245, 238, 0.8), rgba(255, 160, 122, 0.8))", // Gradient for Sushi
//   "linear-gradient(135deg, rgba(245, 222, 179, 0.8), rgba(189, 183, 107, 0.8))", // Gradient for Salad
//   "linear-gradient(135deg, rgba(250, 235, 215, 0.8), rgba(210, 105, 30, 0.8))", // Gradient for Pasta
//   "linear-gradient(135deg, rgba(255, 250, 205, 0.8), rgba(255, 215, 0, 0.8))", // Gradient for Dessert
//   "linear-gradient(135deg, rgba(253, 245, 230, 0.8), rgba(160, 82, 45, 0.8))", // Gradient for Drinks
//   "linear-gradient(135deg, rgba(245, 245, 220, 0.8), rgba(139, 69, 19, 0.8))", // Gradient for Steak
// ];

// const interactiveTextColorPalette = [
//   "#3E2723", // Deep brown for Pizza (good contrast on warm backgrounds)
//   "#4B0082", // Indigo for Burger
//   "#3E2723", // Deep brown for Biryani
//   "#1A237E", // Navy blue for Asian
//   "#8B0000", // Dark red for Sushi
//   "#556B2F", // Dark olive green for Salad
//   "#2F4F4F", // Dark slate gray for Pasta
//   "#DAA520", // Goldenrod for Dessert
//   "#4682B4", // Steel blue for Drinks
//   "#4B0082", // Indigo for Steak
// ];
