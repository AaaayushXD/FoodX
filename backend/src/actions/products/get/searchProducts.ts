import { APIError } from "../../../helpers/error/ApiError.js";
import { searchItemInDatabase } from "../../../helpers/search/product/searchProduct.js";
import logger from "../../../utils/logger/logger.js";

export const searchProductInDatabase = async (query: string) => {
  try {
    const productSnapshot = await searchItemInDatabase(
      "products",
      query,
      "name",
      10
    );

    const specialSnapshot = await searchItemInDatabase(
      "specials",
      query,
      "name",
      10
    );

    let searchResult: Product.SearchResult[] = [
      ...productSnapshot.docs.map((doc) => ({
        ...(doc.data() as Product.ProductInfo),
        type: "products",
      })),
      ...specialSnapshot.docs.map((doc) => ({
        ...(doc.data() as Product.ProductInfo),
        type: "specials",
      })),
    ];

    searchResult.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    searchResult = searchResult.slice(0, 9);

    return searchResult;
  } catch (error) {
    logger.error("Error while searching products: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError("Error while searching products. " + error, 500);
  }
};
