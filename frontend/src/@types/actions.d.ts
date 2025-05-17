declare namespace Actions {
  interface addRevenue
    extends Omit<Models.Revenue, "createdAt" | "updatedAt"> {}

  interface AddNotification {
    uid: string;
    title: string;
    message: string;
  }

  interface DeleteNotification extends Pick<Model.Notification, "id"> {}

  interface UpdateProfile {
    avatar?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  }

  interface Login {
    email: string;
    password: string;
  }

  interface Register<T> {
    avatar: T;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmpassword?: string;
    role: Auth.role;
  }

  interface GetOrderModal<T>
    extends Common.FetchPaginate<T, Model.OrderStatus | ""> {
    status?: Model.OrderStatus;
    userId?: string;
  }
}
