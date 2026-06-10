"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

import type { AppDispatch, RootState } from "@/store";
import { restoreAuth, logout } from "@/store/slices/authSlice";
import { AUTH_TOKEN_KEY } from "@/constants/auth";

const PUBLIC_ROUTES = ["/login"];

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const initializedRef = useRef(false);

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    if (authState.loading) return;

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (!authState.isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (authState.isAuthenticated && pathname === "/login") {
      router.replace("/employees");
    }
  }, [authState.loading, authState.isAuthenticated, pathname, router]);

  return authState;
}

export function useRequireAuth() {
  const auth = useAuth();

  return {
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
  };
}
