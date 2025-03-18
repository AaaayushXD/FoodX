import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const updateUserDataInFirestore = async (
  uid: string,
  access: User.RoleType,
  field: keyof User.UserInfo,
  data: string
) => {
  try {
    const customerDocRef = db.collection(access).doc(uid);
    if (!customerDocRef)
      throw new APIError("User doesnt exist in the database.", 404);
    const userDoc = await customerDocRef.get();
    const docData = userDoc.data();
    if (!docData)
      throw new APIError("Unable to fetch data from database.", 404);

    await customerDocRef.update({
      [`${field}`]: data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to update data." + error, 500);
  }
};
