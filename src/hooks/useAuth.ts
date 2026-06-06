'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import type { RootState, AppDispatch } from '@/store';
import { restoreAuth } from '@/store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Restore auth from storage once on mount
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  // Handle route protection AFTER auth is restored
  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));

    // Only redirect after hydration is complete (small delay)
    const timer = setTimeout(() => {
      if (!isAuthenticated && !isPublicPath) {
        router.replace('/login');
      }
      if (isAuthenticated && pathname === '/login') {
        router.replace('/employees');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading, pathname, router]);

  return { user, isAuthenticated, loading, error };
}

export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  return { isAuthenticated, loading };
}
