import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const getAllCategoryFromDatabase = async () => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new APIError("No category collection found.", 404);
  try {
    const category = await categoryRef.get();
    let categories: Category.CategoryInfo[] = [];
    if (category.empty) throw new APIError("No category found.", 404);
    category.docs.forEach((doc) => {
      const data = doc.data() as Category.CategoryInfo;
      categories.push(data);
    });
    return categories;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Unable to get category data from database. " + error,
      500
    );
  }
};
