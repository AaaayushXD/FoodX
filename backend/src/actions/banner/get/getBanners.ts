import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getBannersFromDatabase = async (collection: string) => {
  const bannerRef = db.collection(collection);
  if (!bannerRef) throw new APIError("No banner collection found.", 404);

  try {
    const bannerDocs = await bannerRef.get();
    let banners: Banner.BannerInfo[] = [];
    if (bannerDocs.empty) return { banners: [], collection };
    bannerDocs.forEach((doc) => {
      const data = doc.data() as Banner.BannerInfo;
      banners.push(data);
    });
    return { banners, collection };
  } catch (error) {
    logger.error(`Error getting banners: ${error}`);
    throw new APIError("Unable to get banners from database. " + error, 500);
  }
};
