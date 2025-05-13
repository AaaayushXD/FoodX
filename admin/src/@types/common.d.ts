declare namespace Common {
  type ImageFolder = "users" | "products" | "banners" | "categories";
  type TicketStatus = "pending" | "progress" | "resolved" | "cancelled";
  type LogAction =
    | "login"
    | "register"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "checkout";

  type ProductCollection = "products" | "specials";

  type AssetsType = "users" | "products" | "banners" | "categories" | "default";

  type OrderStatus =
    | "pending"
    | "preparing"
    | "prepared"
    | "completed"
    | "cancelled";

  interface TimeStamp {
    _seconds: number;
    _nanoseconds: number;
  }

  interface TableActions {
    checkAllFn?: (isChecked: boolean) => void;
    editFn?: (id: string) => void;
    deleteFn?: (id: string) => void;
    viewFn?: (id: string) => void;
    checkFn?: (id: string, isChecked: boolean) => void;
  }

  interface ColumnProps {
    fieldName: string | React.ReactNode;
    colStyle?: React.CSSProperties;
    render?: (item: any) => React.ReactNode;
  }

  interface TableModalProps<T> {
    data: Array<T>;
    totalData: number;
    selectedData?: string[];
    columns: ColumnProps[];
    actions?: TableActions;
    loading?: boolean;
    headStyle?: React.CSSProperties;
    actionIconColor?: string;
    bodyHeight?: number;
    pagination?: {
      perPage?: number;
      currentPage?: number;
    };
    handlePageDirection?: (pageDirection: "next" | "prev") => void;
    disableNoData?: boolean;
    onPageChange?: (page: number) => void;
    disableActions?: boolean;
  }
}
