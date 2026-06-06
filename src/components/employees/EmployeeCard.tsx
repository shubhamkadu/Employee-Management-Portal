'use client';

import type { Employee } from '@/types/employee';
import { EmployeeStatus } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/helpers';
import Link from 'next/link';
import { Eye, Mail, Briefcase } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const isActive = employee.status === EmployeeStatus.ACTIVE;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-gray-500">#{employee.id}</p>
            </div>
          </div>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full mr-1',
                isActive ? 'bg-green-500' : 'bg-red-500'
              )}
            />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            {employee.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 text-gray-400" />
            {employee.department}
          </div>
        </div>

        <Link
          href={`/employees/${employee.id}`}
          className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
      </CardContent>
    </Card>
  );
}
