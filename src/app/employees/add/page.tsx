'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmployeeForm } from '@/components/employees/EmployeeForm';

export default function AddEmployeePage() {
  const { isAuthenticated, loading: authLoading } = useRequireAuth();

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
      <EmployeeForm />
    </MainLayout>
  );
}
