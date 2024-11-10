import { db } from "./index.js";
import { ApiError } from "../utils/ApiError.js";

export const paginateFnc = async (
  collection: string,
  orderBy: string,
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  pageSize: number = 10,
  sort: "asc" | "desc" = "asc",
  direction?: "prev" | "next",
  uid?: string,
  orderStatus?:
    | "pending"
    | "preparing"
    | "prepared"
    | "completed"
    | "cancelled",
  action?:
    | "login"
    | "register"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "checkout",
  ticketStatus?: "pending" | "resolved" | "cancelled",
  category?: string
) => {
  let query = db.collection(collection).orderBy(orderBy, sort);
  if (uid) {
    query = query.where("uid", "==", uid);
  }
  if (orderStatus) {
    query = query.where("status", "==", orderStatus);
  }
  if (action) {
    query = query.where("action", "==", action);
  }
  if (ticketStatus) {
    query = query.where("status", "==", ticketStatus);
  }
  if (category) {
    query = query.where("category", "==", category);
  }
  const lengthOfDoc = await query.get();
  const totalLength = lengthOfDoc.size;
  if (direction === "next" && startAfterDoc) {
    const getStartAfterDoc = await db
      .collection(collection)
      .doc(startAfterDoc)
      .get();
    query = query.startAfter(getStartAfterDoc).limit(pageSize);
  } else if (direction === "prev" && startAtDoc) {
    const getStartAtDoc = await db.collection(collection).doc(startAtDoc).get();
    query = query.endBefore(getStartAtDoc).limitToLast(pageSize);
  } else {
    query = query.limit(pageSize);
  }
  return { query, totalLength } as {
    query: FirebaseFirestore.Query<
      FirebaseFirestore.DocumentData,
      FirebaseFirestore.DocumentData
    >;
    totalLength: number;
  };
};

export const searchItemInDatabase = async (
  collection: string,
  query: string,
  fieldName: string,
  limit: number = 10
) => {
  try {
    const snapshot = await db
      .collection(collection)
      .where(fieldName, ">=", query)
      .where(fieldName, "<=", query + "\uf8ff")
      .limit(limit)
      .get();
    return snapshot;
  } catch (error) {
    throw new ApiError(
      500,
      "Eror while searching item in database.",
      null,
      error as string[]
    );
  }
};
