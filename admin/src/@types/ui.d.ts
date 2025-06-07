declare namespace Ui {
  type BannerCollection = "sponsors" | "banners";
  interface BannerModel {
    id: string;
    title: string;
    image: string;
    date?: string;
    path: BannerCollection;
  }

  interface Banner extends Omit<BannerModel, "date"> {
    date: Common.TimeStamp;
  }

  interface Category {
    id: string;
    name: string;
    image: string;
    bannerImage?: string;
    item: number;
    order: number;
    revenue: number;
    description?: string;

  }

  interface Order extends Order_Timestamps {
    orderId: string;
    name?: string;
    uid?: string;
    products: Product[];
    note?: string;
    orderRequest: string;
    status?: Common.OrderStatus;
    orderFullfilled?: string;
  }

  interface OrderModal extends Omit<Order, "orderId"> {
    phoneNumber?: string;
    image: string;
    id?: string;
    rank?: number;
  }

  interface TicketType {
    id: string;
    category: string;
    name?: string;
    title?: string;
    description: string;
    date: string;
    status?: Common.TicketStatus;
    uid?: string;
    createdAt?: Common.TimeStamp;
    updateAt?: Common.TimeStamp;
  }

  interface Product {
    id: string;
    image: string;
    bannerImg?: string;
    description?: string;
    rating?: string;
    discountPrice?: number;
    cookingTime?: string;
    name: string;
    price: number | string;
    order?: number;
    revenue?: number;
    rating?: string;
    quantity: number | string;
    tag?: string;
    tagId: string;
    category?: string;
    type?: ProductCollection;
  }
}
