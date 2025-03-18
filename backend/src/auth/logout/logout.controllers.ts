import { Request, Response } from "express";
import { updateUserDataInFirestore } from "../../actions/user/update/updateUser.js";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { LogoutSchemaType } from "../../utils/validate/auth/logoutSchema.js";

const options = {
  httpOnly: true,
  secure: true,
};

const logOutUser = asyncHandler(
  async (req: Request<{}, {}, LogoutSchemaType>, res: Response) => {
    const { uid, role } = req.body;
    let response: API.ApiResponse;
    await updateUserDataInFirestore(uid, role, "refreshToken", "");
    response = {
      data: [],
      message: "User logged out successfully",
      success: true,
      status: 200,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(response);
  }
);

export { logOutUser };
