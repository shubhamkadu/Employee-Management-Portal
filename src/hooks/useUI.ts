"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  addToast,
  removeToast,
  toggleSidebar,
  setIsMobile,
} from "@/store/slices/uiSlice";
import type { Toast } from "@/types/ui";
import { useCallback, useEffect, useState } from "react";

export function useUI() {
  const dispatch = useDispatch<AppDispatch>();

  const { toasts, sidebarOpen } = useSelector((state: RootState) => state.ui);

  // SSR-safe mobile detection
  const [isMobile, setIsMobileLocal] = useState(false);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      dispatch(addToast(toast));
    },
    [dispatch],
  );

  const hideToast = useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch],
  );

  const toggleSidebarMenu = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileLocal(mobile);
      dispatch(setIsMobile(mobile));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return {
    toasts,
    sidebarOpen,
    isMobile,
    showToast,
    hideToast,
    toggleSidebarMenu,
  };
}
