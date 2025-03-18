declare namespace Notification {
  interface NotificationData {
    uid: string;
    title: string;
    message: string;
    createdAt: string;
  }

  interface NotificationDetail extends NotificationData {
    id: string;
  }
}
