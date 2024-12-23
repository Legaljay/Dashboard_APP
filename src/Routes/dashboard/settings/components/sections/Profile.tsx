import React from 'react';
import { motion } from 'framer-motion';
import UserForm from '../UserForm';
import BusinessForm from '../BusinessForm';
import TwoFA from '../TwoFA';

interface ProfileProps {
  isFormModified: boolean;
  setIsFormModified: (modified: boolean) => void;
}

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const Profile: React.FC<ProfileProps> = () => {

  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-4xl mx-auto mb-24"
    >
      <UserForm/>
      <hr />
      <BusinessForm/>
      <hr />
      <TwoFA/>
    </motion.div>
  );
};

export default Profile;
