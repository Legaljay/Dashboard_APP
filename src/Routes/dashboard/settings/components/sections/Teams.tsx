import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux-slice/hooks';

interface TeamsProps {
  isFormModified: boolean;
  setIsFormModified: (modified: boolean) => void;
}

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const Teams: React.FC<TeamsProps> = () => {
  const teams = useAppSelector((state) => state.team.members);

  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Team Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your team members and their access levels.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          {/* Team List */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Your Teams</h2>
            <div className="mt-4 space-y-4">
              {teams?.map((team) => (
                <div 
                  key={team.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{team.role}</h3>
                    <p className="text-sm text-gray-500">{team.status} members</p>
                  </div>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {/* Handle team management */}}
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Team Button */}
          <div className="pt-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => {/* Handle add team */}}
            >
              Create New Team
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Teams;
