declare namespace Ui {
  interface Product {
    id: string;
    image: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    cookingTime?: string;
    rating?: string;
    tag?: string;
    tagId?: string;
    totalSold?: number;
    createdAt?: Common.TimeStamp;
    updatedAt?: Common.TimeStamp;
    collection?: Common.ProductCollection;
    discount?: number;
  }

  interface SpecialProducts extends Product {
    discount: number;
  }

  type BannerType = "banners" | "sponsors";

  interface FeedbackInfo {
    uid: string;
    userId?: string;
    productId: string;
    rating: string;
    message: string;
    image?: string;
  }

  interface Banner {
    id: string;
    title: string;
    image: string;
    link: string;
    date?: Date | string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface Category {
    id: string; //pk
    name: string;
    image: string;
    description?: string;
    bannerImage?: string;
    createdAt?: Common.TimeStamp;
    updatedAt?: Common.TimeStamp;
  }

  interface SlideProp {
    url: string;
  }

  interface Slides {
    slides: SlideProp[];
  }

  export interface Favourite {
    id: string; //pk
    uid: string;
    products?: Product[];
    createdAt?: Date;
    updatedAt?: Date;
  }
}
