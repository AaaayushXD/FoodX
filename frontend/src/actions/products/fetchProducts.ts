import { getAllProducts } from "@/hooks";
import { setLoading, setError, productAdd } from "@/reducer";
import { AppDispatch, RootState } from "@/store";
import dayjs from "dayjs";

const isStale = (lastFetched: number) => {
  const FIVE_MINUTES = 5 * 60 * 1000;
  const diff = Date.now() - lastFetched > FIVE_MINUTES;
  // const remainingMinutes = Math.floor((Date.now() - lastFetched) / (1000 * 60));

  return diff;
};

export const fetchProducts =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { lastFetched, products } = getState().root.product;

    // If the data is stale, fetch new data
    if (!lastFetched || isStale(lastFetched as number)) {
      const allProducts = await getAllProducts();

      dispatch(setLoading(true));
      try {
        dispatch(
          productAdd({ products: allProducts, lastFetched: Date.now() })
        );
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
