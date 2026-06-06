import type { LoginCredentials } from "@/types/auth";
import { z } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

// Industry Standard: Define reusable Zod schemas instead of manual validation functions
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function validateLoginForm(credentials: LoginCredentials): ValidationError[] {
  const result = loginSchema.safeParse(credentials);
  if (result.success) return [];

  return result.error.errors.map((err) => ({
    field: err.path[0] as string,
    message: err.message,
  }));
}

export function getFieldError(
  errors: ValidationError[],
  field: string,
): string | undefined {
  return errors.find((error) => error.field === field)?.message;
}
