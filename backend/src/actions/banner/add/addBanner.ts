import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const addBannerToFirestore = async (
  title: string,
  image: string,
  collection: string,
  link: string,
  description?: string
) => {
  const bannerRef = db.collection(collection);
  if (!bannerRef) throw new APIError("No banner collection found.", 404);
  try {
    const banner = await bannerRef
      .add({
        id: "",
        title,
        image,
        link,
        description: description && description,
        date: new Date(),
      })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        })
      );
    return { banner, collection };
  } catch (error) {
    logger.error(`Error adding banner: ${error}`);
    throw new APIError("Unable to add banner in database. " + error, 500);
  }
};
