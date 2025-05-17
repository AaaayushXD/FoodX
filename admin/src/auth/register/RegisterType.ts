interface RegisterType {
  type: string;
  name: string;
  id: string;
  placeholder: string;
}

export const RegisterInputs: RegisterType[] = [
  {
    type: "text",
    name: "email",
    id: "email",
    placeholder: "Enter your email",
  },
];
