"use client";

import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import {
  fetchEmployees,
  searchEmployees,
  setSort,
  setPage,
  setPageSize,
  restoreState,
} from "@/store/slices/employeeSlice";
import { useEmployeeState } from "@/hooks/useEmployee";
import { useRequireAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { EmployeeStats } from "@/components/employees/EmployeeStats";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/helpers";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import type { EmployeeSort } from "@/types/employee";

export default function EmployeesPage() {
  const { isAuthenticated, loading: authLoading } = useRequireAuth();
  const dispatch = useDispatch<AppDispatch>();

  const {
    employees,
    loading,
    error,
    filters,
    sort,
    pagination,
    updatePage,
    updatePageSize,
  } = useEmployeeState();

  useEffect(() => {
    dispatch(restoreState());
  }, [dispatch]);

  // Fetch employees when filters/pagination/sort change
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    if (filters.search) {
      dispatch(searchEmployees(filters.search));
    } else {
      dispatch(fetchEmployees());
    }
  }, [
    dispatch,
    isAuthenticated,
    authLoading,
    filters.search,
    pagination.page,
    pagination.pageSize,
    sort,
  ]);

  // Filter employees locally for department and status
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (filters.department) {
      result = result.filter((e) => e.department === filters.department);
    }

    if (filters.status) {
      result = result.filter((e) => e.status === filters.status);
    }

    // Sort locally
    result.sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case "name":
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`,
          );
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "department":
          comparison = a.department.localeCompare(b.department);
          break;
        case "designation":
          comparison = a.designation.localeCompare(b.designation);
          break;
      }
      return sort.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [employees, filters.department, filters.status, sort]);

  // Paginate locally
  const paginatedEmployees = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return filteredEmployees.slice(start, start + pagination.pageSize);
  }, [filteredEmployees, pagination.page, pagination.pageSize]);

  const totalPages =
    Math.ceil(filteredEmployees.length / pagination.pageSize) || 1;

  const handleSortChange = (
    field: "name" | "email" | "department" | "designation",
    direction: "asc" | "desc",
  ) => {
    const newSort: EmployeeSort = { field, direction };
    dispatch(setSort(newSort));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-7 h-7 text-primary-600" />
              Employees
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your team members and their details
            </p>
          </div>
          <Link href="/employees/add">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <EmployeeStats employees={filteredEmployees} loading={loading} />

        {/* Filters */}
        <EmployeeFilters />

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => dispatch(fetchEmployees())}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && employees.length === 0 && (
          <div className="hidden md:block">
            <TableSkeleton />
          </div>
        )}

        {/* Desktop Table - hidden on mobile */}
        <div
          className={cn(
            "hidden md:block",
            loading &&
              employees.length > 0 &&
              "opacity-60 pointer-events-none transition-opacity duration-200",
          )}
        >
          {(employees.length > 0 || !loading) && (
            <div className="card overflow-hidden">
              <EmployeeTable
                data={paginatedEmployees}
                sorting={sort}
                onSortingChange={handleSortChange}
              />
              <Pagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={updatePage}
                pageSize={pagination.pageSize}
                onPageSizeChange={updatePageSize}
                totalItems={filteredEmployees.length}
              />
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div
          className={cn(
            "block md:hidden",
            loading &&
              employees.length > 0 &&
              "opacity-60 pointer-events-none transition-opacity duration-200",
          )}
        >
          {(employees.length > 0 || !loading) && (
            <div className="space-y-4">
              {paginatedEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
              {paginatedEmployees.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg font-medium text-gray-500">
                    No employees found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
              <Pagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={updatePage}
                pageSize={pagination.pageSize}
                onPageSizeChange={updatePageSize}
                totalItems={filteredEmployees.length}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
