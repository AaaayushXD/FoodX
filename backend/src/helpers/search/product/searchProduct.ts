import { db } from "../../../firebase/index.js";
import logger from "../../../utils/logger/logger.js";
import { APIError } from "../../error/ApiError.js";

export const searchItemInDatabase = async (
  collection: string,
  query: string,
  fieldName: string,
  limit: number = 10
) => {
  try {
    const snapshot = await db
      .collection(collection)
      .where(fieldName, ">=", query)
      .where(fieldName, "<=", query + "\uf8ff")
      .limit(limit)
      .get();
    return snapshot;
  } catch (error) {
    logger.error(
      `Error while searching item in database: ${error}`
    );
    throw new APIError("Error while searching item in database. " + error, 500);
  }
};
