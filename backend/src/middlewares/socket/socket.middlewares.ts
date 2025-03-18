import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { verifyToken } from "../../utils/token/tokenHandler.js";

export const verifySocketUser = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) throw new Error("Unauthorized access, Tokens unaviable.");

    const decodedAccessToken = await verifyToken(token, "access");

    const user = await getUserWithIdFromDatabase(
      decodedAccessToken.role,
      `${decodedAccessToken.uid}`
    );
    if (!user) throw new Error("User doesn't exist.");

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Error while verifying user for socket connection" + error));
  }
};

export const verifySocketChef = async (socket: any, next: any) => {
  try {
    const user = socket.user;

    if (!user) throw new Error("No user found while verifying chef");

    if (user.role !== "chef") throw new Error("Unauthorized access.");

    next();
  } catch (error) {
    next(new Error("Error while verifying chef."));
  }
};
