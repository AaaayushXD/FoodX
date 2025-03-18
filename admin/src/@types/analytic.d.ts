

declare namespace Analytic {
  interface LineChartType {
    time: string;
    revenue?: number;
    order?: number;
  }

  
  interface Revenue {
    id: string;
    orders: Product[];
  }
  // Interface representing each order
  interface OrderProduct {
    pid: string; // Product ID
    price: number; // Price of the item
    quantity: number; // Quantity of the item ordered
    category: string; // Category of the item (e.g., "momo", "cold drinks")
    name: string; // Name of the item
  }

  interface DailyOrders {
    id: string; // Date in YYYY-MM-DD format
    orders: OrderProduct[]; // Array of orders for the given date
  }

  // Interface representing the entire chart data
  interface ChartData {
    chartData: DailyOrders[]; // Array of daily orders data
  }
  interface RevenueInfo extends Revenue {
    createdAt: Common.TimeStamp;
    updatedAt: Common.TimeStamp;
  }

  interface DailyCategoryAgrregateData {
    label: string;
    value: string | number;
  }

  interface DailyAggregateData {
    title: string;
    total: string | number;
    percentage: number | string;
  }

  interface CardAnalytic {
    title: string;
    total: number;
    percentage: number | string;
    subtitle?: string;
  }
}
