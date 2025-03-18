import { useQuery, useQueryClient } from "react-query";
import { getNormalProducts, getSpecialProducts } from "@/services";
import { useAppDispatch, useAppSelector } from "./useActions";
import { useEffect } from "react";
import { fetchProducts } from "@/actions";
import { clearProducts } from "@/reducer";

export const getAllProducts = async (
  specialProducts?: Ui.Product[]
): Promise<Ui.Product[]> => {
  try {
    let existProducts: Ui.Product[];
    const normalProducts = await getNormalProducts();
    const aggregateProducts = normalProducts?.data?.map((product) => {
      return {
        ...product,
        collection: "products" as Common.ProductCollection,
      };
    });
    if (!specialProducts) {
      const unExistProducts = await getSpecialProducts();
      const aggregateSpecialProducts = unExistProducts?.data?.map((product) => {
        return {
          ...product,
          collection: "specials" as Common.ProductCollection,
        };
      });
      existProducts = [...aggregateProducts, ...aggregateSpecialProducts];
    } else {
      existProducts = [...aggregateProducts, ...specialProducts];
    }
    return existProducts;
  } catch (error) {
    throw new Error("Error while fetching all products " + error);
  }
};

export const useAllProducts = () => {
  const { products, isError, isLoading, lastFetched } =
    useAppSelector().product;
  const dispatch = useAppDispatch();
  useEffect(() => {
   
    const timer = setTimeout(() => {
      if (lastFetched && Date.now() - lastFetched > 5 * 60 * 1000) {
        dispatch(clearProducts()); 
        dispatch(fetchProducts());
      }
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
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
  return useQuery<Ui.Product[]>("specials", specialsProductsFn, {
    staleTime: 2 * 60 * 1000,
    cacheTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
