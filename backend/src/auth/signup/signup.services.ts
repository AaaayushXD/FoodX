import { addUserToFirestore } from "../../actions/user/add/addUser.js";
import { doesUserExist } from "../../actions/user/get/doesUserExist.js";
import { APIError } from "../../helpers/error/ApiError.js";
import logger from "../../utils/logger/logger.js";

export const signUp = async (user: Auth.Register) => {
  try {
    const doesExist = await doesUserExist(user.email, user.phoneNumber);
    if (doesExist) throw new APIError("User already exists", 400);

    const userData = await addUserToFirestore(user, user.role);
    return userData;
  } catch (error) {
    logger.error(`Error signing up user with email: ${error}`);
    if (error instanceof APIError) throw error;
    throw new APIError("Error signing up user. " + error, 500);
  }
};
