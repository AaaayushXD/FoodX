declare namespace Order {
  interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    tagId: string;
  }
  interface Order {
    orderId: string;
    uid: string;
    products: Product[];
    status: OrderStatus;
    note: string;
    orderRequest: any;
    orderFullFilled: any;
    image?: string;
    paymentMethod: "online" | "cash";
  }

  type OrderStatus =
    | "pending"
    | "preparing"
    | "prepared"
    | "completed"
    | "cancelled";

  interface OrderInfo extends Order {
    createdAt: any;
    updatedAt: any;
  }
}
