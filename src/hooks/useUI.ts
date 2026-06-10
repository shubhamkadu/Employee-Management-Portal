"use client";

import { useCallback, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store";

import {
  addToast,
  removeToast,
  toggleSidebar,
  setIsMobile,
} from "@/store/slices/uiSlice";

import type { Toast } from "@/types/ui";

export function useUI() {
  const dispatch = useDispatch<AppDispatch>();

  const uiState = useSelector((state: RootState) => state.ui);

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
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateDeviceState = () => {
      dispatch(setIsMobile(mediaQuery.matches));
    };

    updateDeviceState();

    mediaQuery.addEventListener("change", updateDeviceState);

    return () => {
      mediaQuery.removeEventListener("change", updateDeviceState);
    };
  }, [dispatch]);

  return {
    ...uiState,
    showToast,
    hideToast,
    toggleSidebarMenu,
  };
}
