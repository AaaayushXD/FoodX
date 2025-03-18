import { paginateFnc } from "../../../helpers/paginate/paginate.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const getLogsFromDatabase = async (
  path: "adminLogs" | "chefLogs" | "customerLogs",
  pageSize: number,
  sort: "asc" | "desc" = "asc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  uid?: string,
  action?:
    | "login"
    | "register"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "checkout"
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      path,
      "createdAt",
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction,
      uid,
      undefined,
      action
    );
    const logsDoc = await query.get();
    const logs: Logs.LogData[] = [];

    if (logsDoc.empty) {
      return {
        logs,
        firstDoc: null,
        lastDoc: null,
        length: 0,
      };
    }

    logsDoc.docs.forEach((doc) => {
      logs.push(doc.data() as Logs.LogData);
    });

    const firstDoc = logsDoc.docs[0]?.data().id || null;
    const lastDoc = logsDoc.docs[logsDoc.docs.length - 1]?.data().id || null;
    return {
      logs,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Error fetching products from database. " + error, 500);
  }
};
