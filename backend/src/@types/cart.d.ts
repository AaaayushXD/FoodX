declare namespace Cart {
  interface CartData {
    uid: string;
    products: string[];
  }

  interface CartInfo extends CartData {
    createdAt: any;
    updatedAt: any;
  }
}

