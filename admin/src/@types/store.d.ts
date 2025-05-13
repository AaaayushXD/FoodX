declare namespace Store {
  export interface UpdateProfileInfo {
    avatar?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  }

  interface Login {
    readonly onSuccess?: (value:boolean) => void;
    readonly email: string;
    readonly password: string;
    readonly role: Auth.UserRole;
  }
}
