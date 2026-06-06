"use client";

import { useCallback, useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useEmployeeState } from "@/hooks/useEmployee";
import { DEPARTMENTS } from "@/constants/employee";
import { EmployeeStatus } from "@/types/employee";
import { debounce } from "@/utils/helpers";
import { Search, Filter, X } from "lucide-react";

export function EmployeeFilters() {
  const { filters, updateFilters } = useEmployeeState();
  const [searchValue, setSearchValue] = useState(filters.search);

  const MIN_SEARCH_LENGTH = 2;

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        const trimmed = value.trim();
        updateFilters({
          search: trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : "",
        });
      }, 300),
    [updateFilters],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedUpdate(value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ department: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ status: e.target.value as EmployeeStatus | "" });
  };

  const clearAllFilters = () => {
    setSearchValue("");
    updateFilters({ search: "", department: "", status: "" });
  };

  const hasActiveFilters =
    filters.search || filters.department || filters.status;

  const departmentOptions = [
    { value: "", label: "All Departments" },
    ...DEPARTMENTS.map((dept) => ({ value: dept, label: dept })),
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: EmployeeStatus.ACTIVE, label: "Active" },
    { value: EmployeeStatus.INACTIVE, label: "Inactive" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select
            options={departmentOptions}
            value={filters.department}
            onChange={handleDepartmentChange}
            className="w-48"
          />
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
            className="w-40"
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              leftIcon={<X className="w-4 h-4" />}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Active filters:</span>
          {filters.search && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
              Search: {filters.search}
            </span>
          )}
          {filters.department && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
              Dept: {filters.department}
            </span>
          )}
          {filters.status && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
              Status: {filters.status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
