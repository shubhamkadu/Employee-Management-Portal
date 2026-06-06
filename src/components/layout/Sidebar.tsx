'use client';

import { useUI } from '@/hooks/useUI';
import { cn } from '@/utils/helpers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserPlus, LayoutDashboard, X } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/employees', icon: LayoutDashboard },
  { name: 'All Employees', href: '/employees', icon: Users },
  { name: 'Add Employee', href: '/employees/add', icon: UserPlus },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebarMenu, isMobile } = useUI();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40"
          onClick={toggleSidebarMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button
            onClick={toggleSidebarMenu}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && toggleSidebarMenu()}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
