import React, { Suspense } from 'react';
import { RouterProvider as ReactRouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from '../Routes/routes.config';

// Loading component for Suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-white">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

export const RouterProvider: React.FC = () => {
  const router = createBrowserRouter(routes);

  return (
    <Suspense fallback={<Loading />}>
      <ReactRouterProvider router={router} />
    </Suspense>
  );
};
