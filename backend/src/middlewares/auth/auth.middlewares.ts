import dotenv from "dotenv";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { verifyToken } from "../../utils/token/tokenHandler.js";

dotenv.config();

export const verifyRoles = (allowedRoles: User.RoleType[]) => {
  return asyncHandler(async (req: any, _: any, next: any) => {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) throw new Error("Unauthorized access, Tokens unaviable.");
    const decodedAccessToken = await verifyToken(accessToken, "access");

    const user = await getUserWithIdFromDatabase(
      decodedAccessToken.role,
      `${decodedAccessToken.uid}`
    );
    if (!user) throw new Error("User doesn't exist.");

    req.user = user;
    if (!allowedRoles.includes(user.role)) {
      throw new Error(`Unauthorized access. ${user.role} cannot access.`);
    }
    next();
  });
};
