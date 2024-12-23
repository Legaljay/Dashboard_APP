import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-200">
      <header className="sticky top-0 z-30 w-full border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 transition-colors duration-200">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Add your logo or branding here */}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* Add other header items here */}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar can be added here */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
