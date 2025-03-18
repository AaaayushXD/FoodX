import { APIError } from "../../error/ApiError.js";
import { searchItemInDatabase } from "../product/searchProduct.js";

export const searchUserInDatabase = async (query: string) => {
  try {
    const customerSnapshot = await searchItemInDatabase(
      "customer",
      query,
      "firstName",
      5
    );

    const chefSnapshot = await searchItemInDatabase(
      "chef",
      query,
      "firstName",
      5
    );
    const adminSnapshot = await searchItemInDatabase(
      "admin",
      query,
      "firstName",
      5
    );
    let searchResult: User.UserInfo[] = [
      ...customerSnapshot.docs.map((doc) => ({
        ...(doc.data() as User.UserInfo),
      })),
      ...chefSnapshot.docs.map((doc) => ({
        ...(doc.data() as User.UserInfo),
      })),
      ...adminSnapshot.docs.map((doc) => ({
        ...(doc.data() as User.UserInfo),
      })),
    ];

    searchResult.sort((a, b) => {

      return a.fullName.localeCompare(b.fullName);
    });
    searchResult = searchResult.slice(0, 9);

    return searchResult;
  } catch (error) {
    throw new APIError(
      "Error while searching user based on username. " + error,
      500
    );
  }
};
