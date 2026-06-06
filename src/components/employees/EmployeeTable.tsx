"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";
import type { Employee } from "@/types/employee";
import { EmployeeStatus } from "@/types/employee";
import { cn } from "@/utils/helpers";
import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from "lucide-react";

interface EmployeeTableProps {
  data: Employee[];
  sorting: { field: string; direction: "asc" | "desc" };
  onSortingChange: (
    field: "name" | "email" | "department" | "designation",
    direction: "asc" | "desc",
  ) => void;
}

export function EmployeeTable({
  data,
  sorting,
  onSortingChange,
}: EmployeeTableProps) {
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Employee ID",
        cell: ({ row }) => (
          <span className="font-mono text-gray-600">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: "firstName",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {row.original.firstName[0]}
              {row.original.lastName[0]}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {row.original.firstName} {row.original.lastName}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-gray-600">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {row.original.department}
          </span>
        ),
      },
      {
        accessorKey: "designation",
        header: "Designation",
        cell: ({ row }) => (
          <span className="text-gray-700">{row.original.designation}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.original.status === EmployeeStatus.ACTIVE;
          return (
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1.5",
                  isActive ? "bg-green-500" : "bg-red-500",
                )}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Link
            href={`/employees/${row.original.id}`}
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  type SortableField = "name" | "email" | "department" | "designation";
  const handleSort = (field: SortableField) => {
    const newDirection =
      sorting.field === field && sorting.direction === "asc" ? "desc" : "asc";
    onSortingChange(field, newDirection);
  };

  const getSortIcon = (field: string) => {
    if (sorting.field !== field)
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sorting.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 text-primary-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary-600" />
    );
  };

  const sortableFields = [
    "name",
    "email",
    "department",
    "designation",
  ] as const;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const field = header.column
                  .id as (typeof sortableFields)[number];
                const isSortable = sortableFields.includes(field);

                return (
                  <th
                    key={header.id}
                    className={cn(
                      "table-header",
                      isSortable &&
                        "cursor-pointer select-none hover:bg-gray-100",
                    )}
                    onClick={() => isSortable && handleSort(field)}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {isSortable && getSortIcon(field)}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="table-cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="text-gray-500">
                  <p className="text-lg font-medium">No employees found</p>
                  <p className="text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
