import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./index";
// import { Role } from "../Components/Register/Validation";
// import { Admin } from "./index";
const signUpNewUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  avatar: string
) => {
  if (!email || !password)
    throw new Error("Please provide an email and a password");
  try {
    const usercredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = usercredentials.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
      photoURL: avatar,
    });

    // const uid = user.uid;
    // await Admin.auth().setCustomUserClaims(uid, { admin: Role.customer });
  } catch (error) {
    throw new Error(`Error while signing new user. ${error}`);
  }
};

const signInUser = async (email: string, password: string) => {
  if (!email || !password)
    throw new Error("Please provide an email and a password");

  try {
    const userInfo = await signInWithEmailAndPassword(auth, email, password);
    if (!userInfo)
      throw new Error("No user found. Please try signing in first.");

    return userInfo.user;
  } catch (error) {
    throw new Error(`Error while signing user. ${error}`);
  }
};
const signOutUser = async () => {
  try {
    const userInfo = auth.currentUser;
    if (!userInfo) throw new Error("Error while signing out.");
    await signOut(auth);
    return userInfo;
  } catch (error) {
    throw new Error(`Error signing out user. ${error}`);
  }
};

export { signOutUser, signInUser, signUpNewUser };
