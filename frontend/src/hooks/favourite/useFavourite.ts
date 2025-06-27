import toast from "react-hot-toast";
import { addFavourite, removeFavourites } from "@/services";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addToFavourite, removeFavourite } from "@/reducer";
import { toaster } from "@/utils";
import { ApiError } from "@/helpers";

export const useFavourite = (id: Ui.Product["id"]) => {
  const { auth, favourite } = useAppSelector();
  const dispatch = useAppDispatch();

  const addFavouriteProduct = async (id: Ui.Product["id"]) => {
  
    if(!auth?.userInfo?.uid) {
      return toaster({
        title: "Please login to add to favourite",
        icon: "error",
        className: "bg-red-50",
      });
    }
    const loading = toaster({
      title: "Please wait...",
      icon: "loading",
    });
    try {
      const response = await addFavourite({
        uid: auth?.userInfo?.uid as string,
        productId: id,
      });
      dispatch(addToFavourite(id));
      if (response?.message)
        toaster({
          icon: "success",
          title: response?.message,
          message: "You can view your favourite products",
          className: " bg-green-50 ",
        });
    } catch (error) {
      if (error instanceof ApiError) {
        // toaster({
        //   icon: "error",
        //   title: error?.message, 
        //   className: "bg-red-50",
        // });
      }
    } finally {
      toast.dismiss(loading);
    }
  };
  const isFavourite = (id: string) => {
    return favourite?.favourite?.some((singleProduct) => singleProduct === id);
  };

  const heartColor = isFavourite(id)
    ? "fill-red-500  text-red-500 "
    : "fill-transparent";

  const removeFavouriteProduct = async () => {
    const loading = toaster({
      title: "Please wait...",
      icon: "loading",
    });

    try {
      const response = await removeFavourites({
        uid: auth?.userInfo?.uid as string,
        productId: id,
      });
      if (response?.message)
        toaster({
          message: response?.message,
          icon: "delete",
          className: " bg-green-50",
        });
      dispatch(removeFavourite(id));
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          message: error?.message,
          className: "bg-red-50",
          icon: "error",
        });
      }
    } finally {
      toast.dismiss(loading);
    }
  };
  return {
    addFavouriteProduct,
    auth,
    favourite,
    heartColor,
    removeFavouriteProduct,
    isFavourite,
  };
};
