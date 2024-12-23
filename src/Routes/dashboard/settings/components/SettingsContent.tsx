import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { settingsRoutes } from '../routes';
import LoadingSpinner from '@/LoadingFallback';

interface SettingsContentProps {
  isFormModified?: boolean;
  setIsFormModified?: (modified: boolean) => void;
}

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const SettingsContent: React.FC<SettingsContentProps> = () => {
  const location = useLocation();

  return (
    <div
      className="w-full p-10 !sticky top-[0] z-0 overflow-y-scroll hide-scrollbar"
      style={{
        height: 'calc(92vh)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<div className="h-screen w-full"><LoadingSpinner /></div>}>
            <Routes location={location}>
              {Object.values(settingsRoutes).map(({ path, component: Component }) => (
                <Route
                  key={path}
                  path={path === '/dashboard/settings' ? '/' : path.replace('/dashboard/settings/', '')}
                  element={
                    <Component/>
                  }
                />
              ))}
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
