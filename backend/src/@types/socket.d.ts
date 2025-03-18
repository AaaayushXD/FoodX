import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: {
      uid: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      password: string;
      avatar: string;
      refreshToken: string;
      role: RoleType;
      totalOrder: number;
      totalSpent: number;
      createdAt: any;
      updatedAt: any;
    };
  }
}
