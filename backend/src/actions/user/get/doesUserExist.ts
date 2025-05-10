import { Filter, QuerySnapshot } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import logger from "../../../utils/logger/logger.js";
const USER_COLLECTIONS = ["admin", "chef", "customer"];
export const doesUserExist = async (
  email?: string,
  phoneNumber?: string
): Promise<boolean> => {
  try {
    if (!email && !phoneNumber) {
      console.warn("Email or PhoneNumber is required to check user existence.");
      return false;
    }

    const queryFilters: FirebaseFirestore.Filter[] = [];
    if (email) {
      queryFilters.push(Filter.where("email", "==", email));
    }
    if (phoneNumber) {
      queryFilters.push(Filter.where("phoneNumber", "==", phoneNumber));
    }

    if (queryFilters.length === 0) {
      return false;
    }

    const combinedFilter = Filter.or(...queryFilters);

    const queryPromises: Promise<QuerySnapshot>[] = USER_COLLECTIONS.map(
      (collectionName) => {
        const collectionRef = db.collection(collectionName);
        const q = collectionRef.where(combinedFilter).limit(1);
        return q.get();
      }
    );

    const snapshots = await Promise.all(queryPromises);

    for (const snapshot of snapshots) {
      if (!snapshot.empty) {
        return true;
      }
    }
    return false;
  } catch (error) {
    logger.error(`Error while checking user existence in database: ${error}`);
    throw new Error(
      `Failed to check user existence across roles: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
