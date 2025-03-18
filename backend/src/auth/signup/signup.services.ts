import { addUserToFirestore } from "../../actions/user/add/addUser.js";
import { APIError } from "../../helpers/error/ApiError.js";
import {
  isEmailValid,
  isPasswordValid,
} from "../../helpers/validator/auth.validator.js";

export const signUp = async (user: Auth.Register) => {
  try {
    if (!isEmailValid(user.email) && !isPasswordValid(user.password))
      throw new APIError("Invalid email or password", 400);

    const userData = await addUserToFirestore(user, user.role);
    return userData;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Error signing up user. " + error, 500);
  }
};
