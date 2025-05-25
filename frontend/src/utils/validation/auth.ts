import { z } from "zod";

// Regular expressions for validation
const LOWERCASE_REGEX = /[a-z]/;
const UPPERCASE_REGEX = /[A-Z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*]/;
const COLLEGE_EMAIL_DOMAIN = "texascollege.edu.np";

// Registration schema
export const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "* Required" }),
    lastName: z.string().min(1, { message: "* Required" }),
    email: z
      .string()
      .min(1, { message: "* Required" })
      .email({ message: "Invalid email address" })
      .refine(
        (email) => email.toLowerCase().endsWith(`@${COLLEGE_EMAIL_DOMAIN}`),
        {
          message: `Please enter a valid ${COLLEGE_EMAIL_DOMAIN} email address`,
        }
      ),
    phoneNumber: z
      .string()
      .min(1, { message: "* Required" })
      .min(10, { message: "Invalid Number" }),
    password: z
      .string()
      .min(1, { message: "* Required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .refine((password) => LOWERCASE_REGEX.test(password), {
        message: "Must contain a lowercase character",
      })
      .refine((password) => UPPERCASE_REGEX.test(password), {
        message: "Must contain an uppercase character",
      })
      .refine((password) => DIGIT_REGEX.test(password), {
        message: "Must contain a digit",
      })
      .refine((password) => SPECIAL_CHAR_REGEX.test(password), {
        message: "Must contain a special character [! @ # $ % ^ & *]",
      }),
    confirmPassword: z.string().min(1, { message: "* Required" }),
    avatar: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "* Required" })
    .email({ message: "Invalid email address" })
    .refine(
      (email) => email.toLowerCase().endsWith(`@${COLLEGE_EMAIL_DOMAIN}`),
      {
        message: `Please enter a valid ${COLLEGE_EMAIL_DOMAIN} email address`,
      }
    ),
  password: z
    .string()
    .min(1, { message: "* Required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .refine((password) => LOWERCASE_REGEX.test(password), {
      message: "Must contain a lowercase character",
    })
    .refine((password) => UPPERCASE_REGEX.test(password), {
      message: "Must contain an uppercase character",
    })
    .refine((password) => DIGIT_REGEX.test(password), {
      message: "Must contain a digit",
    })
    .refine((password) => SPECIAL_CHAR_REGEX.test(password), {
      message: "Must contain a special character [! @ # $ % ^ & *]",
    }),
});

// Types derived from the schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Helper function to validate registration data
export const validateRegistration = (data: unknown) => {
  return registerSchema.safeParse(data);
};

// Helper function to validate login data
export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data);
};
