import { useQuery } from "react-query";
import { getCategories } from "../../services/category";

export const useAllCategory = () => {
  //   const queryClient = useQueryClient();
  return useQuery("categories-1", getCategories, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
