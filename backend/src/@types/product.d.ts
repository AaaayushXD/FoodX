declare namespace Product {
  interface ProductData {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    tagId: string;
    totalSold: number;
  }
  interface UploadProductType {
    product: Product;
    collection: Collection["name"];
  }

  interface Collection {
    name: "products" | "specials";
  }

  interface SearchResult extends ProductData {
    type: string;
  }

  interface ProductInfo extends ProductData {
    createdAt: any;
    updatedAt: any;
  }
}
