declare namespace Logs {
  interface LogData {
    id: string;
    uid: string;
    name: string;
    profile: string;
    action:
      | "login"
      | "register"
      | "logout"
      | "create"
      | "update"
      | "delete"
      | "checkout";

    detail?: string;
    date: Date;
  }

  interface LogsInfo extends LogData {
    createdAt: any;
    updatedAt: any;
  }
}
