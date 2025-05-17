declare namespace Action {
  interface AddNotification {
    uid: string;
    title: string;
    message: string;
  }

  interface DeleteNotification extends Pick<Notification, "id"> {}

  type LogPath = "adminLogs" | "chefLogs" | "customerLogs";

  interface AddLog extends Common.FetchPaginate {
    path: LogPath;
    action: Common.LogAction;
  }

  interface UpdateCategory {
    category?: "specials" | "products";
    id: string;
    field: string;
    newData: string;
  }

  interface UploadProduct {
    product: Ui.Product;
    collection: Common.ProductCollection;
  }
}
