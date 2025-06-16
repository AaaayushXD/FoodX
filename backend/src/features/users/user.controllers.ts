import { Request, Response } from "express";
import { addUserToFirestore } from "../../actions/user/add/addUser.js";
import { deleteUserFromFireStore } from "../../actions/user/delete/deleteUser.js";
import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { updateUserDataInFirestore } from "../../actions/user/update/updateUser.js";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import {
  generateAccessAndRefreshToken,
  verifyToken,
} from "../../utils/token/tokenHandler.js";
import { getUsersFromDatabase } from "../../actions/user/get/getUsers.js";
import { bulkDeleteUserFromDatabase } from "../../actions/user/delete/bulkDeleteUser.js";
import { searchUserInDatabase } from "../../helpers/search/user/searchUser.js";
import { options } from "../../config/cookieOption.js";
import { APIError } from "../../helpers/error/ApiError.js";
import {
  AccountUpdateSchemaType,
  UserRoleUpdateSchemaType,
  UserUpdateSchemaType,
} from "../../utils/validate/user/update/user.update.schema.js";
import { UserSchemaType } from "../../utils/validate/user/user.schema.js";
import { BulkDeleteSchemaType } from "../../utils/validate/user/delete/bulk-delete.schema.js";
import { PaginationSchemaType } from "../../utils/validate/pagination/paginationSchema.js";

const updateAccount = asyncHandler(
  async (req: Request<{}, {}, AccountUpdateSchemaType>, res: Response) => {
    const { fullName, phoneNumber, avatar } = req.body;
    let response: API.ApiResponse;
    if (!fullName && !phoneNumber && !avatar)
      throw new APIError("No data provided to update.", 400);

    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const decodedToken = await verifyToken(accessToken, "access");

    const user = await getUserWithIdFromDatabase(
      decodedToken.role,
      decodedToken.uid
    );

    if (fullName) {
      await updateUserDataInFirestore(
        user.uid,
        user.role,
        "fullName",
        fullName?.trim()
      );
    }

    if (phoneNumber) {
      await updateUserDataInFirestore(
        user.uid,
        user.role,
        "phoneNumber",
        phoneNumber
      );
    }

    if (avatar) {
      await updateUserDataInFirestore(user.uid, user.role, "avatar", avatar);
    }
    const updatedUser = await getUserWithIdFromDatabase(user.role, user.uid);
    response = {
      status: 200,
      data: updatedUser,
      message: "Successfully updated user data.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const updateUser = asyncHandler(
  async (req: Request<{}, {}, UserUpdateSchemaType>, res: Response) => {
    const { uid, role, fullName, phoneNumber, avatar } = req.body;
    let response: API.ApiResponse;

    if (!uid || !role)
      throw new APIError(
        "User id and role is required to update user data.",
        400
      );
    if (!fullName && !phoneNumber && !avatar)
      throw new APIError("No data provided to update.", 400);

    if (fullName) {
      await updateUserDataInFirestore(uid, role, "fullName", fullName?.trim());
    }

    if (phoneNumber) {
      await updateUserDataInFirestore(uid, role, "phoneNumber", phoneNumber);
    }

    if (avatar) {
      await updateUserDataInFirestore(uid, role, "avatar", avatar);
    }

    const updatedUser = await getUserWithIdFromDatabase(role, uid);
    response = {
      status: 200,
      data: updatedUser,
      message: "Successfully updated user data.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const updateUserRole = asyncHandler(
  async (req: Request<{}, {}, UserRoleUpdateSchemaType>, res: Response) => {
    const { uid, role, newRole } = req.body;

    let response: API.ApiResponse;
    const user = await getUserWithIdFromDatabase(role, uid);
    if (!user) throw new APIError("User not found.", 404);

    await deleteUserFromFireStore(uid, user.role);
    user.role = newRole;
    const newUser = await addUserToFirestore(
      {
        ...user,
        firstName: user.fullName.split(" ")[0]?.trim(),
        lastName: user.fullName.split(" ")[1]?.trim(),
      },
      newRole,
      uid
    );
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      newUser.uid,
      newRole
    );
    if (!accessToken || !refreshToken) {
      await deleteUserFromFireStore(newUser.uid, newRole);
      throw new APIError("Error generating tokens.", 500);
    }
    response = {
      status: 200,
      data: {
        user: {
          ...newUser,
          password: "",
        },
        accessToken,
        refreshToken,
      },
      message: "User's Role updated successfully.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const getUser = asyncHandler(
  async (
    req: Request<{ role: User.RoleType }, {}, {}, { userId: string }>,
    res: Response
  ) => {
    const role = req.params.role;
    const userId = req.query.userId;

    if (!role || !userId)
      throw new APIError("No role or user id provided.", 400);

    let response: API.ApiResponse;
    const user = await getUserWithIdFromDatabase(role, userId);
    if (!user) throw new APIError("User not found.", 404);
    response = {
      status: 200,
      data: user,
      message: "Successfully fetched user information.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const fetchUsers = asyncHandler(
  async (
    req: Request<
      {},
      {},
      PaginationSchemaType & {
        path: "customer" | "admin" | "chef";
        filter?: keyof User.UserInfo;
      }
    >,
    res: Response
  ) => {
    let {
      path,
      pageSize,
      filter,
      sort,
      direction,
      currentFirstDoc,
      currentLastDoc,
    } = req.body;

    if (!path) throw new APIError("Path is required.", 400);

    let { users, firstDoc, lastDoc, length } = await getUsersFromDatabase(
      path,
      pageSize ? pageSize : 10,
      filter,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction
    );
    const response: API.ApiResponse = {
      status: 200,
      data: {
        users,
        currentFirstDoc: firstDoc,
        currentLastDoc: lastDoc,
        length,
      },
      message: "Successfully fetched users from database",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const deleteAccount = asyncHandler(
  async (req: Request<{}, {}, UserSchemaType>, res: Response) => {
    const { uid, role } = req.body;
    const foundUser = await getUserWithIdFromDatabase(role, uid);
    if (!foundUser) throw new APIError("User not found.", 404);

    await deleteUserFromFireStore(foundUser.uid, foundUser.role);
    const response: API.ApiResponse = {
      status: 200,
      data: [],
      message: "User deleted successfully",
      success: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(response);
  }
);

const deleteUser = asyncHandler(
  async (req: Request<{}, {}, UserSchemaType>, res: Response) => {
    const { uid, role } = req.body;
    const foundUser = await getUserWithIdFromDatabase(role, uid);
    if (!foundUser) throw new APIError("User not found.", 404);

    await deleteUserFromFireStore(foundUser.uid, foundUser.role);
    const response: API.ApiResponse = {
      status: 200,
      data: [],
      message: "User deleted successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const deleteUsersInBulk = asyncHandler(
  async (req: Request<{}, {}, BulkDeleteSchemaType>, res: Response) => {
    const { role, ids } = req.body;

    await bulkDeleteUserFromDatabase(role, ids);

    const response: API.ApiResponse = {
      status: 200,
      data: [],
      message: "Users deleted successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const getSearchUser = asyncHandler(async (req: Request, res: Response) => {
  const search = req.query.search as string;
  if (!search) throw new APIError("No search query provided.", 400);

  const users = await searchUserInDatabase(search);
  if (!users) throw new APIError("No user found.", 404);

  const response: API.ApiResponse = {
    status: 200,
    data: users,
    message: "User fetched successfully.",
    success: true,
  };
  return res.status(200).json(response);
});

export {
  deleteAccount,
  updateAccount,
  updateUser,
  updateUserRole,
  deleteUser,
  deleteUsersInBulk,
  fetchUsers,
  getUser,
  getSearchUser,
};
