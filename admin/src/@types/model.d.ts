declare namespace Model {
  export interface Notification extends Omit<Action.AddNotification, "userId"> {
    id: string;
    uid: string;
    createdAt?: Common.TimeStamp;
    updatedAt?: Common.TimeStamp;
  }

  export interface Log {
    id?: string;
    uid?: string;
    name?: string;
    profile?: string;
    action?: Common.LogAction;
    detail?: string;
    date: Date;
    open?: boolean;
    id?: string;
    role?: Auth.UserRole;
    handleClick?: (id: string) => void;
  }
  interface Revenue {
    id: string;
    orders: Product[];
  }

  
}
