'use client';

import { useMemo } from 'react';
import type { Employee } from '@/types/employee';
import { EmployeeStatus } from '@/types/employee';
import { StatCard } from '@/components/ui/StatCard';
import { Users, UserCheck, UserX, Building2 } from 'lucide-react';
import { CardSkeleton } from '@/components/ui/Skeleton';

interface EmployeeStatsProps {
  employees: Employee[];
  loading: boolean;
}

export function EmployeeStats({ employees, loading }: EmployeeStatsProps) {
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === EmployeeStatus.ACTIVE).length;
    const inactive = employees.filter((e) => e.status === EmployeeStatus.INACTIVE).length;
    const departments = new Set(employees.map((e) => e.department)).size;

    return { total, active, inactive, departments };
  }, [employees]);

  if (loading) {
    return <CardSkeleton count={4} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Employees"
        value={stats.total}
        icon={<Users className="w-6 h-6" />}
        color="blue"
      />
      <StatCard
        title="Active Employees"
        value={stats.active}
        icon={<UserCheck className="w-6 h-6" />}
        color="green"
      />
      <StatCard
        title="Inactive Employees"
        value={stats.inactive}
        icon={<UserX className="w-6 h-6" />}
        color="red"
      />
      <StatCard
        title="Total Departments"
        value={stats.departments}
        icon={<Building2 className="w-6 h-6" />}
        color="purple"
      />
    </div>
  );
}
