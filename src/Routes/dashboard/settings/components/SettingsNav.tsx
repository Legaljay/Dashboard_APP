import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { settingsRoutes } from '../routes';

interface SettingsNavProps {
  handleNavigate: (path: string) => void;
  isFormModified?: boolean;
}

const navVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export const SettingsNav: React.FC<SettingsNavProps> = ({
  handleNavigate,
  isFormModified
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <motion.div
      className="pt-[35px] pl-[27px] pr-[43px] bg-inherit flex flex-col gap-5 select-none border-r border-[#F7F7F7]"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      {Object.values(settingsRoutes).map((route) => (
        <motion.button
          key={route.path}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`font-medium text-sm text-start p-[10px_16px] w-[135px] transform transition-transform outline-none ${
            currentPath === route.path
              ? "text-[#1774FD] bg-[#FAFAFA] rounded-md"
              : "text-[#7F7F81]"
          }`}
          onClick={() => handleNavigate(route.path)}
          disabled={isFormModified}
        >
          {route.label}
        </motion.button>
      ))}
    </motion.div>
  );
};
