import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { updateUserDataInFirestore } from "../../actions/user/update/updateUser.js";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { APIError } from "../../helpers/error/ApiError.js";
import {
  generateAccessAndRefreshToken,
  verifyToken,
} from "../../utils/token/tokenHandler.js";

export const refreshAccessToken = asyncHandler(async (req: any, res: any) => {
  let response: API.ApiResponse;
  const incomingRefreshToken: string =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken || incomingRefreshToken.length === 0) throw new APIError("No token available.", 401);

  const decodedToken = await verifyToken(incomingRefreshToken, "refresh");

  const user = await getUserWithIdFromDatabase(
    decodedToken.role,
    decodedToken.uid.trim()
  );
  if (!user) throw new APIError("User not found.", 404);

  if (incomingRefreshToken !== user.refreshToken)
    throw new APIError("Token is invalid.", 401);

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user.uid, user.role);

  await updateUserDataInFirestore(
    user.uid,
    user.role,
    "refreshToken",
    newRefreshToken
  );

  user.refreshToken = newRefreshToken;

  response = {
    data: { accessToken, refreshToken: newRefreshToken },
    message: "Access Token refreshed",
    success: true,
    status: 200,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", newRefreshToken)
    .json(response);
});
