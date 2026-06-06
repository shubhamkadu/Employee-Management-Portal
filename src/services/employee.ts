import { apiService } from "./api";
import type { Employee, DummyUser, EmployeeFormData } from "@/types/employee";
import { EmployeeStatus } from "@/types/employee";
import { EMPLOYEE_STORAGE_KEY } from "@/constants/employee";

// Map DummyUser to Employee domain model
function mapDummyUserToEmployee(user: DummyUser): Employee {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    company: user.company,
    department: user.company.department,
    designation: user.company.title,
    status:
      Math.random() > 0.3 ? EmployeeStatus.ACTIVE : EmployeeStatus.INACTIVE,
  };
}

// Get local employees from localStorage
function getLocalEmployees(): Employee[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const stored = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save local employees to localStorage
function saveLocalEmployees(employees: Employee[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
}

export const employeeService = {
  async fetchEmployees(
    params: {
      limit?: number;
      skip?: number;
      sortBy?: string;
      order?: "asc" | "desc";
    } = {},
  ): Promise<{ employees: Employee[]; total: number }> {
    const response = await apiService.getUsers({
      ...params,
      select: "id,firstName,lastName,email,phone,address,company",
    });

    const apiEmployees = response.users.map(mapDummyUserToEmployee);
    const localEmployees = getLocalEmployees();

    // Combine API and local employees
    const allEmployees = [...apiEmployees, ...localEmployees];

    return {
      employees: allEmployees,
      total: response.total + localEmployees.length,
    };
  },

  async searchEmployees(
    query: string,
    params: {
      limit?: number;
      skip?: number;
    } = {},
  ): Promise<{ employees: Employee[]; total: number }> {
    const response = await apiService.searchUsers(query, params);

    const apiEmployees = response.users.map(mapDummyUserToEmployee);
    const localEmployees = getLocalEmployees().filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(query.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(query.toLowerCase()) ||
        emp.email.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      employees: [...apiEmployees, ...localEmployees],
      total: response.total + localEmployees.length,
    };
  },

  async getEmployeeById(id: number): Promise<Employee | null> {
    // Check local employees first
    const localEmployees = getLocalEmployees();
    const localEmployee = localEmployees.find((emp) => emp.id === id);
    if (localEmployee) return localEmployee;

    try {
      const user = await apiService.getUserById(id);
      return mapDummyUserToEmployee(user);
    } catch {
      return null;
    }
  },

  addEmployee(formData: EmployeeFormData): Employee {
    const localEmployees = getLocalEmployees();
    const newEmployee: Employee = {
      id: Date.now(), // Use timestamp as ID for local employees
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: "",
      address: {
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      company: {
        name: "",
        title: formData.designation,
        department: formData.department,
      },
      department: formData.department,
      designation: formData.designation,
      status: formData.status,
    };

    const updatedEmployees = [newEmployee, ...localEmployees];
    saveLocalEmployees(updatedEmployees);

    return newEmployee;
  },

  getLocalEmployees,
  saveLocalEmployees,
};
