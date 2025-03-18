import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./index";

const emailVerification = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Unable to send email verification");
    await sendEmailVerification(currentUser);
  } catch (error) {
    throw new Error("Error sending verification email");
  }
};

const passwordResetEmail = async () => {
  try {
    const email = auth.currentUser?.email;
    if (!email) throw new Error("No user logged in.");
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error("Error sending password reset email");
  }
};

const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in. Login first!");
    await deleteUser(user);
  } catch (error) {
    throw new Error("Error while deleting user.");
  }
};

const updateUserProfile = async (photoURL: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in. Login first!");
    await updateProfile(user, { photoURL });
  } catch (error) {
    throw new Error("Error updating user profile.");
  }
};

const updateUserPassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in. Login first!");
    await updatePassword(user, newPassword);
  } catch (error) {
    throw new Error("Error updating password. ");
  }
};

const reAuthUser = async (email: string, password: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in.");

    const credentials = EmailAuthProvider.credential(email, password);

    await reauthenticateWithCredential(user, credentials);
  } catch (error) {
    throw new Error("Error reauthetication.");
  }
};

export {
  emailVerification,
  passwordResetEmail,
  updateUserProfile,
  updateUserPassword,
  deleteAccount,
  reAuthUser,
};
