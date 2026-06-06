export const API_BASE_URL = "/api";

export const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Product",
  "Legal",
  "IT",
] as const;

export const DESIGNATIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Marketing Manager",
  "Sales Representative",
  "HR Manager",
  "Financial Analyst",
  "Operations Manager",
  "Legal Counsel",
  "IT Support Specialist",
  "Data Analyst",
  "DevOps Engineer",
  "QA Engineer",
  "Business Analyst",
] as const;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export const EMPLOYEE_STORAGE_KEY = "local_employees";
