import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const getBannersFromDatabase = async (collection: string) => {
  const bannerRef = db.collection(collection);
  if (!bannerRef) throw new APIError("No banner collection found.", 404);

  try {
    const bannerDocs = await bannerRef.get();
    let banners: Banner.BannerInfo[] = [];
    if (bannerDocs.empty) throw new APIError("No banners found.", 404);
    bannerDocs.forEach((doc) => {
      const data = doc.data() as Banner.BannerInfo;
      banners.push(data);
    });
    return { banners, collection };
  } catch (error) {
    throw new APIError("Unable to get banners from database. " + error, 500);
  }
};
