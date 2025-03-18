declare namespace Revenue {
  interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    tagId: string;
  }
  interface RevenueData {
    id: string; // date only.. do not include time
    orders: Product[];
  }

  interface OrderProp {
    orderRequest: Date;
    products: Product[];
  }

  interface RevenueInfo extends RevenueData {
    createdAt: any;
    updatedAt: any;
  }
}
