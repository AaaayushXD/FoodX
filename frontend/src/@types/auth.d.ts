declare namespace Auth {
  type role = "admin" | "chef" | "customer";
  interface User {
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

  interface authState {
    loading: boolean;
    userInfo: User;
    error: any;
    success: boolean;
  }

  interface ValidationType extends Partial<Omit<User, "fullName">> {
    firstName?: string;
    lastName?: string;
    password: string;
    confirmPassword?: string;
    oldPassword?: string;
  }
}
