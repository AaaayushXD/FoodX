import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { addBannerToFirestore } from "../../actions/banner/add/addBanner.js";
import { getBannersFromDatabase } from "../../actions/banner/get/getBanners.js";
import { bulkDeleteBannersFromDatabase } from "../../actions/banner/delete/bulkDeleteBanner.js";
import { deleteBannerFromDatabase } from "../../actions/banner/delete/deleteBanner.js";
import { redisClient } from "../../utils/cache/cache.js";
import { BannerSchemaType } from "../../utils/validate/banner/bannerSchema.js";

const addNewBanner = asyncHandler(
  async (req: Request<{}, {}, BannerSchemaType>, res: Response) => {
    const { title, image, link, type, description } = req.body;
    let response: API.ApiResponse;

    const { collection } = await addBannerToFirestore(
      title,
      image,
      link,
      type,
      description ? description : ""
    );
    const getBanners = await getBannersFromDatabase(collection);
    await redisClient.set(collection, JSON.stringify(getBanners), {
      EX: 3600,
    });

    response = {
      status: 201,
      data: { banner: getBanners, collection },
      message: "New banner added successfully",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const getAllBanners = asyncHandler(async (req: Request, res: Response) => {
  const path = req.params.path;
  let response: API.ApiResponse;
  const { banners, collection } = await getBannersFromDatabase(path);
  await redisClient.set(`${path}`, JSON.stringify(banners), {
    EX: 3600,
  });
  response = {
    status: 200,
    data: { banners, collection },
    message: "Banners fetched successfully",
    success: true,
  };
  return res.status(200).json(response);
});

const deleteBannersInBulk = asyncHandler(async (req: any, res: any) => {
  const {
    ids,
    path,
  }: {
    ids: string[];
    path: string;
  } = req.body;
  let response: API.ApiResponse;
  const collection = await bulkDeleteBannersFromDatabase(ids, path);
  await redisClient.del(path);
  const getBanners = await getBannersFromDatabase(collection);
  await redisClient.set(collection, JSON.stringify(getBanners), {
    EX: 3600,
  });

  response = {
    status: 200,
    data: { banner: getBanners, collection },
    message: "Banners deleted successfully",
    success: true,
  };
  return res.status(200).json(response);
});
const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id, path } = req.body;

  let response: API.ApiResponse;
  const collection = await deleteBannerFromDatabase(id, path);
  await redisClient.del(path);
  const getBanners = await getBannersFromDatabase(collection);
  await redisClient.set(collection, JSON.stringify(getBanners), {
    EX: 3600,
  });
  response = {
    status: 200,
    data: { banner: getBanners, collection },
    message: "Banner deleted successfully",
    success: true,
  };
  return res.status(200).json(response);
});

export { addNewBanner, getAllBanners, deleteBanner, deleteBannersInBulk };
