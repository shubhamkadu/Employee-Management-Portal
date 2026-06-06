"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addEmployee } from "@/store/slices/employeeSlice";
import type { AppDispatch } from "@/store";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EmployeeStatus } from "@/types/employee";
import { DEPARTMENTS, DESIGNATIONS } from "@/constants/employee";
import { useUI } from "@/hooks/useUI";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  status: z.nativeEnum(EmployeeStatus),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialFormData,
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await dispatch(addEmployee(data)).unwrap();
      showToast({ message: "Employee added successfully!", type: "success" });
      router.replace("/employees"); // Use replace to prevent back-button loops to the form
    } catch (error) {
      showToast({ message: error as string, type: "error" });
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
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Link>
      </div>

      <div className="card ">
        <div className="px-6 py-4 border-b border-gray-200 ">
          <h2 className="text-lg font-semibold text-gray-900 ">
            Add New Employee
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the details to create a new employee record
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register("firstName")}
              error={errors.firstName?.message}
              placeholder="John"
              required
            />
            <Input
              label="Last Name"
              {...register("lastName")}
              error={errors.lastName?.message}
              placeholder="Doe"
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="john.doe@company.com"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              {...register("department")}
              error={errors.department?.message}
              options={departmentOptions}
              placeholder="Select department"
              required
            />
            <Select
              label="Designation"
              {...register("designation")}
              error={errors.designation?.message}
              options={designationOptions}
              placeholder="Select designation"
              required
            />
          </div>

          <Select
            label="Status"
            {...register("status")}
            error={errors.status?.message}
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
              isLoading={isSubmitting}
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
