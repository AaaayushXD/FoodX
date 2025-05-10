import jwt from "jsonwebtoken";
import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { updateUserDataInFirestore } from "../../actions/user/update/updateUser.js";
import { APIError } from "../../helpers/error/ApiError.js";
import logger from "../logger/logger.js";

const getAccessToken = async (uid: string, role: User.RoleType) => {
  try {
    return jwt.sign(
      {
        uid: uid,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY) }
    );
  } catch (error) {
    logger.error("Error generating access token: ", error);
    throw new APIError("Error while generating access token. " + error, 500);
  }
};

const getRefreshtoken = async (uid: string, role: User.RoleType) => {
  try {
    return jwt.sign(
      {
        uid: uid,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY) }
    );
  } catch (error) {
    logger.error("Error generating refresh token: ", error);
    throw new APIError("Error while generating refresh token. " + error, 500);
  }
};

const generateAccessAndRefreshToken = async (
  uid: string,
  role: User.RoleType
) => {
  try {
    const user = await getUserWithIdFromDatabase(role, uid);
    if (!user) throw new APIError("User doesnt exist.", 404);

    const accessToken = await getAccessToken(uid, role);
    const refreshToken = await getRefreshtoken(uid, role);

    user.refreshToken = refreshToken;
    await updateUserDataInFirestore(
      uid,
      user.role,
      "refreshToken",
      refreshToken
    );

    return { accessToken, refreshToken };
  } catch (error) {
    logger.error("Error generating tokens: ", error);
    throw new APIError("Error generating tokens. " + error, 500);
  }
};

const verifyToken = async (
  incomingToken: string,
  type: "refresh" | "access"
) => {
  try {
    const secret =
      type === "refresh"
        ? process.env.REFRESH_TOKEN_SECRET
        : process.env.ACCESS_TOKEN_SECRET;
    const decodedToken = jwt.verify(
      incomingToken,
      `${secret}`
    ) as User.DecodeToken;
    return decodedToken;
  } catch (error) {
    logger.error("Error verifying token: ", error);
    throw new APIError(
      "Error verifying your token. Please try again later. " + error,
      500
    );
  }
};
export { generateAccessAndRefreshToken, verifyToken };
