import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNormalProducts, getSpecialProducts } from "@/services";
import { useAppDispatch, useAppSelector } from "./useActions";
import { useEffect } from "react";
import { fetchProducts } from "@/actions";

export const getAllProducts = async (): Promise<Ui.Product[]> => {
  try {
    const [normalProducts, specialProducts] = await Promise.all([
      getNormalProducts(),
      getSpecialProducts(),
    ]);

    const aggregateProducts = normalProducts?.data?.map((product) => {
      return {
        ...product,
        collection: "products" as Common.ProductCollection,
      };
    });

    const aggregateSpecialProducts = specialProducts?.data?.map((product) => {
      return {
        ...product,
        collection: "specials" as Common.ProductCollection,
      };
    });
    return [...aggregateProducts, ...aggregateSpecialProducts];
  } catch (error) {
    throw new Error("Error while fetching all products " + error);
  }
};

export const useAllProducts = () => {
  const { products, isError, isLoading, lastFetched } =
    useAppSelector().product;
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return {
    products,
    isError,
    isLoading,
  };
};

export const specialsProductsFn = async (): Promise<Ui.Product[]> => {
  try {
    const products = await getSpecialProducts();

    const aggregateSpecialProducts = products?.data?.map((product) => {
      return {
        ...product,
        collection: "specials" as Common.ProductCollection,
      };
    });
    return aggregateSpecialProducts;
  } catch (error) {
    throw new Error("Error while fetching specials products");
  }
};

export const specialProducts = () => {
  return useQuery<Ui.Product[]>({
    queryKey: ["specials", specialsProductsFn],
    staleTime: 2 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
