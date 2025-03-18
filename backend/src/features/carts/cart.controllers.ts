import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { addCartInFirestore } from "../../actions/cart/add/addItemToCart.js";
import { redisClient } from "../../utils/cache/cache.js";
import { getCartsFromFirestore } from "../../actions/cart/get/getCartItems.js";
import { removeItemFromCart } from "../../actions/cart/delete/deleteItemFromCart.js";
import { APIError } from "../../helpers/error/ApiError.js";

const addCarts = asyncHandler(
  async (
    req: Request<{}, {}, { uid: string; productId: string }>,
    res: Response
  ) => {
    const { uid, productId } = req.body;
    if (!uid || !productId)
      throw new APIError("No uid or productId provided.", 400);

    let response: API.ApiResponse;

    await addCartInFirestore(uid, productId);
    await redisClient.del(`carts:${uid}`);
    const updatedCart = await getCartsFromFirestore(uid);

    await redisClient.set(`carts:${uid}`, JSON.stringify(updatedCart), {
      EX: 600,
    });
    response = {
      status: 201,
      data: updatedCart,
      message: "Item successfully added into cart.",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const removeCarts = asyncHandler(
  async (
    req: Request<{}, {}, { uid: string; productId: string }>,
    res: Response
  ) => {
    const { uid, productId } = req.body;
    if (!uid || !productId)
      throw new APIError("No uid or productId provided.", 400);

    let response: API.ApiResponse;

    await removeItemFromCart(uid, productId);
    await redisClient.del(`carts:${uid}`);

    const updatedCart = await getCartsFromFirestore(uid);
    await redisClient.set(`carts:${uid}`, JSON.stringify(updatedCart), {
      EX: 600,
    });

    response = {
      status: 200,
      data: updatedCart,
      message: "Item successfully removed from cart.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const getCarts = asyncHandler(
  async (req: Request<{ uid: string }>, res: Response) => {
    const uid = req.params.uid;
    if (!uid) throw new APIError("No uid provided.", 400);

    let response: API.ApiResponse;

    const cartsData = await getCartsFromFirestore(uid);
    await redisClient.setEx(`carts:${uid}`, 600, JSON.stringify(cartsData));

    response = {
      status: 200,
      data: cartsData,
      message: "Cart items successfully fetched.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

export { addCarts, removeCarts, getCarts };
