export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  company: Company;
  department: string;
  designation: string;
  status: EmployeeStatus;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Company {
  name: string;
  title: string;
  department: string;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  status: EmployeeStatus;
}

export interface EmployeeFilters {
  search: string;
  department: string;
  status: EmployeeStatus | '';
}

export interface EmployeeSort {
  field: 'name' | 'email' | 'department' | 'designation';
  direction: 'asc' | 'desc';
}

export interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  filters: EmployeeFilters;
  sort: EmployeeSort;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  selectedEmployeeId: number | null;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  skip: number;
  limit: number;
}

export interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
    department: string;
  };
}
