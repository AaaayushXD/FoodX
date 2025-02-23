import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { getOrdersFromDatabase } from "../../actions/order/get/getOrders.js";
import { addNewOrderToDatabase } from "../../actions/order/add/addNewOrder.js";
import { updateOrderStatusInDatabase } from "../../actions/order/update/updateOrder.js";
import { io } from "../../index.js";
import { userSocketMap } from "../../utils/socket/index.js";
import { AddOrderSchemaType } from "../../utils/validate/order/add/addOrderSchema.js";
import { UpdateOrderSchemaType } from "../../utils/validate/order/update/updateOrderSchema.js";
import { PaginationSchemaType } from "../../utils/validate/pagination/paginationSchema.js";
import { APIError } from "../../helpers/error/ApiError.js";

const getOrderByUserIdFromDatabase = asyncHandler(
  async (req: Request<{}, {}, PaginationSchemaType>, res: Response) => {
    let { pageSize, direction, startAtDoc, startAfterDoc, status, userId } =
      req.body;

    const user = req.user;
    if (!user) throw new APIError("No user found. Please login first.", 401);

    const limitPage = pageSize ? +pageSize : 10;
    let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
      limitPage,
      direction === "next" ? startAfterDoc : null,
      direction === "prev" ? startAtDoc : null,
      direction,
      status,
      userId
    );

    const response: API.ApiResponse = {
      status: 200,
      data: {
        orders,
        currentFirstDoc: firstDoc,
        currentLastDoc: lastDoc,
        length,
      },
      message: "Successfully fetched user's order from database",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const addNewOrder = asyncHandler(
  async (req: Request<{}, {}, AddOrderSchemaType>, res: Response) => {
    const order = req.body;
    if (!order) throw new Error("Order not found");
    let response: API.ApiResponse;

    const orderId = await addNewOrderToDatabase({
      ...order,
      orderId: "",
      note: order.note || "",
      orderFullFilled: null,
    });
    io.to("chef").emit("new_order", { ...order, orderId });

    response = {
      status: 201,
      data: orderId,
      message: "Order added successfully",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const updateOrder = asyncHandler(
  async (req: Request<{}, {}, UpdateOrderSchemaType>, res: Response) => {
    const { id, status, price, userId } = req.body;
    const socketId = userSocketMap[userId];

    let response: API.ApiResponse;
    const totalPrice = +price;
    const updatedOrder = await updateOrderStatusInDatabase(
      id,
      status,
      totalPrice
    );
    io.to(socketId).emit("order_status", { ...updatedOrder, id, status });
    response = {
      status: 200,
      data: updatedOrder,
      message: "Order updated successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);
const fetchOrders = asyncHandler(
  async (req: Request<{}, {}, PaginationSchemaType>, res: Response) => {
    let { pageSize, direction, startAtDoc, startAfterDoc, status, userId } =
      req.body;

    const limitPage = pageSize ? +pageSize : 10;
    let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
      limitPage,
      direction === "next" ? startAfterDoc : null,
      direction === "prev" ? startAtDoc : null,
      direction,
      status,
      userId
    );
    const response: API.ApiResponse = {
      status: 200,
      data: {
        orders,
        currentFirstDoc: firstDoc,
        currentLastDoc: lastDoc,
        length,
      },
      message: "Successfully fetched orders from database.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const searchOrderBasedOnUid = asyncHandler(
  async (req: Request<{}, {}, PaginationSchemaType>, res: Response) => {
    let { pageSize, direction, startAtDoc, startAfterDoc, status, userId } =
      req.body;

    const limitPage = pageSize ? +pageSize : 10;

    let { orders, firstDoc, lastDoc, length } = await getOrdersFromDatabase(
      limitPage,
      direction === "next" ? startAfterDoc : null,
      direction === "prev" ? startAtDoc : null,
      direction,
      status,
      userId
    );

    const response: API.ApiResponse = {
      status: 200,
      data: {
        orders,
        currentFirstDoc: firstDoc,
        currentLastDoc: lastDoc,
        length,
      },
      message: "Successfully fetched orders from database based on uid.",
      success: true,
    };

    return res.status(200).json(response);
  }
);
export {
  getOrderByUserIdFromDatabase,
  addNewOrder,
  updateOrder,
  fetchOrders,
  searchOrderBasedOnUid,
};
