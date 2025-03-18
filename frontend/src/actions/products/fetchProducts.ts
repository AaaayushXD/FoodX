import { getAllProducts } from "@/hooks";
import { setLoading, setError, productAdd } from "@/reducer";
import { AppDispatch, RootState } from "@/store";

const isStale = (lastFetched) => {
  const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds
  return Date.now() - lastFetched > FIVE_MINUTES;
};

export const fetchProducts =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { lastFetched, products } = getState().root.product;
    const allProducts = await getAllProducts();
    // If the data is stale, fetch new data
    if (!lastFetched || isStale(lastFetched)) {
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
