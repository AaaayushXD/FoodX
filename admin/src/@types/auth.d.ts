declare namespace Auth {
  interface LoginTypes {
    type: "email" | "password";
    id: string;
    name: string;
    icon: boolean;
  }
  //

  interface authState {
    loading: boolean;
    userInfo: User;
    error: boolean;
    success: boolean;
  }

  interface Register {
    avatar: File;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmpassword?: string;
    role?: UserRole["role"];
  }

  interface FetchModal {
    currentFirstDoc: string;
    currentLastDoc: string;
    users: User[];
    length: number;
  }

  interface DbUser {
    avatar: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    refreshToken: string;
    uid: string;
    role?: "admin" | "customers";
  }

  interface User {
    id?: string;
    isVerified?: boolean
    uid?: string;
    avatar?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    role?: role;
    refreshToken?: string;
    totalOrder?: number;
    totalSpent?: number;
    createdAt?: Common.TimeStamp;
    updatedAt?: Common.TimeStamp;
  }

  interface ValidationType extends Partial<Omit<User, "fullName">> {
    firstName?: string;
    lastName?: string;
    password: string;
    confirmPassword?: string;
    oldPassword?: string;
  }

  interface DeleteUser {
    id: string[];
    role: string;
  }

  type UserRole = "admin" | "chef" | "customer";
}
