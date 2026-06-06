'use client';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { setFilters, setSort, setPage, setPageSize } from '@/store/slices/employeeSlice';
import type { EmployeeFilters, EmployeeSort } from '@/types/employee';

export function useEmployeeState() {
  const dispatch = useDispatch<AppDispatch>();

  const { employees, loading, error, filters, sort, pagination } = useSelector(
    (state: RootState) => state.employee
  );

  const updateFilters = (newFilters: Partial<EmployeeFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const updateSort = (newSort: EmployeeSort) => {
    dispatch(setSort(newSort));
  };

  const updatePage = (page: number) => {
    dispatch(setPage(page));
  };

  const updatePageSize = (pageSize: number) => {
    dispatch(setPageSize(pageSize));
  };

  return {
    employees,
    loading,
    error,
    filters,
    sort,
    pagination,
    updateFilters,
    updateSort,
    updatePage,
    updatePageSize,
  };
}
