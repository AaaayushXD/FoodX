declare namespace Store {
  export interface UpdateProfileInfo {
    avatar?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: number;
  }

  interface Login {
    readonly email: string;
    readonly password: string;
    readonly role: Auth.UserRole;
  }
}
