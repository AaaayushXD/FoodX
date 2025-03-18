declare namespace Model {
  type Product = Ui.Product;
  interface Revenue {
    id: string;
    orders: Ui.Product[];
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface Notification extends Omit<Actions.AddNotification, "userId"> {
    id: string;
    uid: string;
    createdAt: Common.TimeStamp;
    updatedAt?: Common.TimeStamp;
  }
  type PaymentMethod = "online" | "cash";

  interface FeedbackDetail extends Ui.FeedbackInfo {
    id: string;
    createdAt: Common.TimeStamp;
    updatedAt: Common.TimeStamp;
  }

  type NotificationoType = "Order Confirmed" | "Order Cancelled";
  interface Rating {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment?: string;
    likes?: string;
    createdAt: Common.TimeStamp;
    updatedAt?: Common.TimeStamp;
  }

  type ProductRating = Record<Rating["productId"], Rating[]>;

  interface OrderProp {
    orderRequest: Date;
    products: Ui.Product[];
  }

  interface Order {
    revenue?: number;
    orderId?: string;
    uid: string;
    products: Ui.Product[];
    orderRequest: string;
    orderFullfilled?: string;
    status: OrderStatus["status"];
    updateAt?: string;
    note?: string;
  }

  type OrderStatus =
    | "pending"
    | "preparing"
    | "prepared"
    | "completed"
    | "cancelled";

  interface UserOrder {
    id: string;
    products: Product[];
    time: string; // Date formatted as MM/DD/YYYY
    status: OrderStatus;
    amount: number;
    // payment: "esewa" | "cash" | "credit_card" | "other"; // Enum-like for payment methods
  }
}
