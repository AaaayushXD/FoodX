import { Request, Response } from "express";
import { addLogToFirestore } from "../../actions/logInfo/add/addLogs.js";
import { getLogsFromDatabase } from "../../actions/logInfo/get/getLogs.js";
import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";

const addLogs = asyncHandler(async (req: Request, res: Response) => {
  const {
    action,
    date,
    detail,
    userId,
    userRole,
  }: {
    action:
      | "login"
      | "register"
      | "logout"
      | "create"
      | "update"
      | "delete"
      | "checkout";
    date: Date;
    detail?: string;
    userId?: string;
    userRole?: "customer" | "admin" | "chef";
  } = req.body;

  let apiResponse: API.ApiResponse;
  if (userId && userRole && (action === "login" || action === "register")) {
    var { uid, avatar, role, fullName } = await getUserWithIdFromDatabase(
      userRole,
      userId
    );
  } else {
    var { uid, avatar, role, fullName } = req.user as User.UserData;
  }
  const response = await addLogToFirestore(
    {
      uid,
      profile: avatar,
      name: fullName,
      action,
      date,
      id: "",
      detail,
    },
    `${role}Logs`
  );
  apiResponse = {
    status: 201,
    data: response,
    message: "Logs added successfully.",
    success: true,
  };
  return res.status(201).json(apiResponse);
});

const fetchLogs = asyncHandler(async (req: Request, res: Response) => {
  let {
    path,
    pageSize,
    sort,
    direction,
    currentFirstDoc,
    currentLastDoc,
    uid,
    action,
  }: {
    path: "adminLogs" | "chefLogs" | "customerLogs";
    pageSize: number;
    filter: keyof Logs.LogsInfo;
    sort: "asc" | "desc";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    direction?: "prev" | "next";
    uid?: string;
    action?:
      | "login"
      | "register"
      | "logout"
      | "create"
      | "update"
      | "delete"
      | "checkout";
  } = req.body;

  let response: API.ApiResponse;
  let { logs, firstDoc, lastDoc, length } = await getLogsFromDatabase(
    path,
    pageSize,
    sort,
    direction === "next" ? currentLastDoc : null,
    direction === "prev" ? currentFirstDoc : null,
    direction,
    uid ? uid : undefined,
    action ? action : undefined
  );
  response = {
    status: 200,
    data: {
      logs,
      currentFirstDoc: firstDoc,
      currentLastDoc: lastDoc,
      length,
    },
    message: "Successfully fetched logs from database",
    success: true,
  };
  return res.status(200).json(response);
});

export { addLogs, fetchLogs };
