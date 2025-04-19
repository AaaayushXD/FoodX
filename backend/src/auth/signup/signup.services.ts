import { addUserToFirestore } from "../../actions/user/add/addUser.js";
import { doesUserExist } from "../../actions/user/get/doesUserExist.js";
import { getUserWithEmailFromDatabase } from "../../actions/user/get/getUserWithEmail.js";
import { getUserWithPhoneNumberFromDatabase } from "../../actions/user/get/getUserWithPhone.js";
import { APIError } from "../../helpers/error/ApiError.js";
import {
  isEmailValid,
  isPasswordValid,
} from "../../helpers/validator/auth.validator.js";

export const signUp = async (user: Auth.Register) => {
  try {
    if (!isEmailValid(user.email) && !isPasswordValid(user.password))
      throw new APIError("Invalid email or password", 400);
    const doesExist = await doesUserExist(user.email, user.phoneNumber);
    if (doesExist) throw new APIError("User already exists", 400);

    const userData = await addUserToFirestore(user, user.role);
    return userData;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Error signing up user. " + error, 500);
  }
};
