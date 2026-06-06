import { isValidEmail } from './helpers';
import type { EmployeeFormData } from '@/types/employee';
import type { LoginCredentials } from '@/types/auth';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateLoginForm(credentials: LoginCredentials): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!credentials.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(credentials.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!credentials.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (credentials.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return errors;
}

export function validateEmployeeForm(data: EmployeeFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.firstName.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!data.lastName.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.department) {
    errors.push({ field: 'department', message: 'Department is required' });
  }

  if (!data.designation) {
    errors.push({ field: 'designation', message: 'Designation is required' });
  }

  if (!data.status) {
    errors.push({ field: 'status', message: 'Status is required' });
  }

  return errors;
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((error) => error.field === field)?.message;
}
