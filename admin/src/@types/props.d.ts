declare namespace Prop {
  interface updateComponentProp {
    path?: "banners" | "sponsors" | string;
    status?: string;
    id: string;
    closeModal?: (isOpen: boolean) => void;
  }

  interface RecentOrderProp {
    orderId: string;
    image: string;
    products: Ui.Product[];
    price: number;
    status: Common.OrderStatus;
    note?: string;
    orderRequest: string;
    uid: string;
    paymentMethod: "cash" | "online";
    paymentImage?: string;
    onChange?: (status: Common.OrderStatus) => void;
    name?: string;

  }

  interface CardAnalyticsProp {
    title: string;
    percentage?: number;
    subtitle?: string;
    filter?: React.ReactNode;
    total: number;
  }
  export interface InvoiceDocumentProp {
    orders: {
      invoiceData: {
        invoiceNumber: string;
        invoiceDate: string;
      };
      customerDetails: {
        name: string;
        phoneNumber: number | string;
        userId: string;
      };
      orderDetails: {
        products: Product[];
        status: status["status"];
      };
    }[];
  }
}
