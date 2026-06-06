"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { employeeService } from "@/services/employee";
import type { Employee } from "@/types/employee";
import { EmployeeStatus } from "@/types/employee";
import { useRequireAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useUI } from "@/hooks/useUI";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  User,
  Activity,
} from "lucide-react";
import { cn } from "@/utils/helpers";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { isAuthenticated, loading: authLoading } = useRequireAuth();
  const { showToast } = useUI();

  const fetchIdRef = useRef<string | null>(null);
  const toastRef = useRef(showToast);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    toastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    if (!isAuthenticated || !id || fetchIdRef.current === id) return;
    fetchIdRef.current = id;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await employeeService.getEmployeeById(Number(id));
        if (data) {
          setEmployee(data);
        } else {
          setError("Employee not found");
          toastRef.current({ message: "Employee not found", type: "error" });
        }
      } catch (err) {
        setError("Failed to load employee details");
        toastRef.current({
          message: "Failed to load employee details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="card p-8 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !employee) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="mb-4">
            <User className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Employee Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The employee you are looking for does not exist or has been removed.
          </p>
          <Link href="/employees">
            <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Employees
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const isActive = employee.status === EmployeeStatus.ACTIVE;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href="/employees"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Link>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{employee.designation}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    )}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        isActive ? "bg-green-500" : "bg-red-500",
                      )}
                    />
                    {isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {employee.department}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-600" />
                Contact Information
              </h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900 break-all">
                    {employee.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-900">
                    {employee.phone || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                Company Information
              </h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Company</p>
                  <p className="text-sm text-gray-900">
                    {employee.company.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Department
                  </p>
                  <p className="text-sm text-gray-900">{employee.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Designation
                  </p>
                  <p className="text-sm text-gray-900">
                    {employee.designation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="md:col-span-2">
            <CardHeader className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                Address
              </h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">
                    {employee.address.address || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {employee.address.city && `${employee.address.city}, `}
                    {employee.address.state && `${employee.address.state} `}
                    {employee.address.postalCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {employee.address.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
