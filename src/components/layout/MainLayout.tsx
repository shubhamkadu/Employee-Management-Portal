'use client';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '@/components/ui/Toast';
import { cn } from '@/utils/helpers';
import { useUI } from '@/hooks/useUI';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isMobile } = useUI();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8',
            !isMobile && 'lg:ml-0'
          )}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
