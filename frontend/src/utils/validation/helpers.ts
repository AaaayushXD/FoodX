import { loginSchema, registerSchema } from './auth';

/**
 * Validates registration data and returns errors in a format compatible with the existing components
 * @param data Registration data to validate
 * @returns Object with validation errors or null if validation passes
 */
export const validateRegistrationForm = (data: unknown): Record<string, string> | null => {
  const result = registerSchema.safeParse(data);
  
  if (result.success) {
    return null;
  }
  
  const errors: Record<string, string> = {};
  
  result.error.errors.forEach((error) => {
    const path = error.path[0] as string;
    errors[path] = error.message;
  });
  
  return errors;
};

/**
 * Validates login data and returns errors in a format compatible with the existing components
 * @param data Login data to validate
 * @returns Object with validation errors or null if validation passes
 */
export const validateLoginForm = (data: unknown): Record<string, string> | null => {
  const result = loginSchema.safeParse(data);
  
  if (result.success) {
    return null;
  }
  
  const errors: Record<string, string> = {};
  
  result.error.errors.forEach((error) => {
    const path = error.path[0] as string;
    errors[path] = error.message;
  });
  
  return errors;
};