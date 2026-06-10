"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store";
import {
  setFilters,
  setSort,
  setPage,
  setPageSize,
} from "@/store/slices/employeeSlice";

import type { EmployeeFilters, EmployeeSort } from "@/types/employee";

export function useEmployeeState() {
  const dispatch = useDispatch<AppDispatch>();

  const employeeState = useSelector((state: RootState) => state.employee);

  const updateFilters = useCallback(
    (filters: Partial<EmployeeFilters>) => {
      dispatch(setFilters(filters));
    },
    [dispatch],
  );

  const updateSort = useCallback(
    (sort: EmployeeSort) => {
      dispatch(setSort(sort));
    },
    [dispatch],
  );

  const updatePage = useCallback(
    (page: number) => {
      dispatch(setPage(page));
    },
    [dispatch],
  );

  const updatePageSize = useCallback(
    (pageSize: number) => {
      dispatch(setPageSize(pageSize));
    },
    [dispatch],
  );

  return {
    ...employeeState,
    updateFilters,
    updateSort,
    updatePage,
    updatePageSize,
  };
}
