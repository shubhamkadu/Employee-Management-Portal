import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Employee, EmployeeState, EmployeeFilters, EmployeeSort, EmployeeFormData } from '@/types/employee';
import { employeeService } from '@/services/employee';
import { DEFAULT_PAGE_SIZE } from '@/constants/employee';

const EMPLOYEE_STATE_KEY = 'employee_state';

// Load persisted state from sessionStorage
const loadPersistedState = (): Partial<EmployeeState> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(EMPLOYEE_STATE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        filters: parsed.filters,
        sort: parsed.sort,
        pagination: parsed.pagination,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return {};
};

// Save state to sessionStorage
const persistState = (state: EmployeeState): void => {
  if (typeof window === 'undefined') return;
  const persisted = {
    filters: state.filters,
    sort: state.sort,
    pagination: state.pagination,
  };
  sessionStorage.setItem(EMPLOYEE_STATE_KEY, JSON.stringify(persisted));
};

const persistedState = loadPersistedState();

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  filters: persistedState.filters || {
    search: '',
    department: '',
    status: '',
  },
  sort: persistedState.sort || {
    field: 'name',
    direction: 'asc',
  },
  pagination: persistedState.pagination || {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  },
  selectedEmployeeId: null,
};

export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { employee: EmployeeState };
      const { pagination, sort } = state.employee;

      const skip = (pagination.page - 1) * pagination.pageSize;

      const response = await employeeService.fetchEmployees({
        limit: pagination.pageSize,
        skip,
        sortBy: sort.field === 'name' ? 'firstName' : sort.field,
        order: sort.direction,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch employees');
    }
  }
);

export const searchEmployees = createAsyncThunk(
  'employee/searchEmployees',
  async (query: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { employee: EmployeeState };
      const { pagination } = state.employee;

      const skip = (pagination.page - 1) * pagination.pageSize;

      const response = await employeeService.searchEmployees(query, {
        limit: pagination.pageSize,
        skip,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search employees');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employee/addEmployee',
  async (formData: EmployeeFormData, { rejectWithValue }) => {
    try {
      const employee = employeeService.addEmployee(formData);
      return employee;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<EmployeeFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
      persistState(state);
    },
    setSort: (state, action: PayloadAction<EmployeeSort>) => {
      state.sort = action.payload;
      persistState(state);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
      persistState(state);
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1;
      persistState(state);
    },
    setSelectedEmployeeId: (state, action: PayloadAction<number | null>) => {
      state.selectedEmployeeId = action.payload;
      // Save state before navigating to details
      persistState(state);
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        department: '',
        status: '',
      };
      state.pagination.page = 1;
      persistState(state);
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreState: (state) => {
      const persisted = loadPersistedState();
      if (persisted.filters) state.filters = persisted.filters;
      if (persisted.sort) state.sort = persisted.sort;
      if (persisted.pagination) state.pagination = persisted.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination.total = action.payload.total;
        persistState(state);
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search employees
      .addCase(searchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination.total = action.payload.total;
      })
      .addCase(searchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add employee
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setSort,
  setPage,
  setPageSize,
  setSelectedEmployeeId,
  clearFilters,
  clearError,
  restoreState,
} = employeeSlice.actions;

export default employeeSlice.reducer;
