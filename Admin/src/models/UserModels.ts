import { PayloadAction } from "@reduxjs/toolkit";
import { User } from "./user.model";

export interface authState {
  loading: boolean;
  userInfo: any[] | null | User;
  error: boolean;
  success: boolean;
}
export interface GetUserModal {
  path: "customer" | "admin" | "chef";
  pageSize: number;
  filter: keyof User;
  sort: "asc" | "desc";
  direction: "prev" | "next";
  currentFirstDoc?: any | null;
  currentLastDoc?: any | null;
}
export interface ImageFolders {
  folder: "users" | "products" | "banners" | "categories";
}

export interface DbUser {
  avatar: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  refreshToken: string;
  uid: string;
  role?: "admin" | "customers";
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Table {
  export interface TableModalProps<T extends { id: string }> {
    data: T[];
    columns: string[];
    actionIconColor?: string;
    actions?: React.ReactNode[];
    bodyHeight?: string;
    disableActions?: boolean;
    disableNoData?: boolean;
    loading?: boolean;
    onPageChange?: (page: number) => void;
    pagination?: {
      perPage: number;
      currentPage: number;
    };
  }
}

export interface PayloadAction<S, User, M, E> {
  meta: M;
  payload: User;
  type: S;
  Error: E;
}
