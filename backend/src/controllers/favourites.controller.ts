import {
  addProductInFavourite,
  getFavouritesFromFirestore,
  removeItemFromFavourite,
} from "../firebase/db/favourite.firestore.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import express from "express";
import { redisClient } from "../utils/Redis.js";

const addFavourite = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { uid, productId } = req.body;
    try {
      await addProductInFavourite(uid, productId);
      await redisClient.del(`favourites:${uid}`);
      const updatedFavourites = await getFavouritesFromFirestore(uid);
      await redisClient.set(
        `favourites:${uid}`,
        JSON.stringify(updatedFavourites),
        {
          EX: 600,
        }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedFavourites,
            "Item successfully added into favourites.",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Error while adding item into favourites.",
            false
          )
        );
    }
  }
);

const removeFavourites = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const { uid, productId } = req.body;
      await removeItemFromFavourite(uid, productId);
      await redisClient.del(`favourites:${uid}`);
      const updatedFavourites = await getFavouritesFromFirestore(uid);
      await redisClient.set(
        `favourites:${uid}`,
        JSON.stringify(updatedFavourites),
        {
          EX: 600,
        }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedFavourites,
            "Item successfully removed from favourites.",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Error while removing item from favourites.",
            false
          )
        );
    }
  }
);

const getFavourites = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const uid = req.params.uid;
      const favouritesData = await getFavouritesFromFirestore(uid);
      await redisClient.setEx(
        `favourites:${uid}`,
        600,
        JSON.stringify(favouritesData)
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            favouritesData,
            "Favourites items successfully fetched.",
            true
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            error as string[],
            "Error while fetching item from favourites.",
            false
          )
        );
    }
  }
);

export { addFavourite, removeFavourites, getFavourites };
