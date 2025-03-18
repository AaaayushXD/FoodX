export interface errorValidationObject {
  avatar: string;
  firstname: string | number;
  lastname: string | number;
  email: string | number;
  password: string | number;
  confirmpassword: string;
  role?: Role;
}

export enum Role {
  customer = "customer",
  admin = "admin",
}
