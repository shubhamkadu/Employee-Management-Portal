"use client";

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addEmployee } from "@/store/slices/employeeSlice";
import type { AppDispatch } from "@/store";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { validateEmployeeForm, getFieldError } from "@/utils/validation";
import type { EmployeeFormData } from "@/types/employee";
import { EmployeeStatus } from "@/types/employee";
import { DEPARTMENTS, DESIGNATIONS } from "@/constants/employee";
import { useUI } from "@/hooks/useUI";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const initialFormData: EmployeeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  designation: "",
  status: EmployeeStatus.ACTIVE,
};

export function EmployeeForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { showToast } = useUI();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const validationErrors = validateEmployeeForm({
          ...formData,
          [name]: value,
        });
        const fieldError = getFieldError(validationErrors, name);
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError || "",
        }));
      }
    },
    [formData, touched],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const validationErrors = validateEmployeeForm(formData);
      const fieldError = getFieldError(validationErrors, name);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError || "",
      }));
    },
    [formData],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = validateEmployeeForm(formData);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      showToast({ message: "Please fix the errors below", type: "error" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await dispatch(addEmployee(formData)).unwrap();
      showToast({ message: "Employee added successfully!", type: "success" });
      router.replace("/employees"); // Use replace to prevent back-button loops to the form
    } catch (error) {
      showToast({ message: error as string, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
  }));

  const designationOptions = DESIGNATIONS.map((desig) => ({
    value: desig,
    label: desig,
  }));

  const statusOptions = [
    { value: EmployeeStatus.ACTIVE, label: "Active" },
    { value: EmployeeStatus.INACTIVE, label: "Inactive" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/employees"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Link>
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Employee
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the details to create a new employee record
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstName}
              placeholder="John"
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lastName}
              placeholder="Doe"
              required
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            placeholder="john.doe@company.com"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.department}
              options={departmentOptions}
              placeholder="Select department"
              required
            />
            <Select
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.designation}
              options={designationOptions}
              placeholder="Select designation"
              required
            />
          </div>

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.status}
            options={statusOptions}
            required
          />

          <div className="flex gap-3 pt-4">
            <Link href="/employees" className="flex-1">
              <Button variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={loading}
              leftIcon={<Save className="w-4 h-4" />}
              className="flex-1"
            >
              Add Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
