import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Analytics = lazy(() => import('./components/Analytics'));

const AnalyticsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Analytics />} />
    </Routes>
  );
};

export default AnalyticsRoutes;
