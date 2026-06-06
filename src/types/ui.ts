export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface UIState {
  toasts: Toast[];
  sidebarOpen: boolean;
  isMobile: boolean;
}
