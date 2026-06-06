import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UIState, Toast } from '@/types/ui';
import { generateId } from '@/utils/helpers';

const initialState: UIState = {
  toasts: [],
  sidebarOpen: false,
  isMobile: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: generateId(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const { addToast, removeToast, toggleSidebar, setSidebarOpen, setIsMobile } = uiSlice.actions;
export default uiSlice.reducer;
