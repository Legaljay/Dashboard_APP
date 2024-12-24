import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux-slice/hooks';
import { selectAdjacentPlans } from '@/redux-slice/business-subscription/business-subscription.slice';

interface PlanProps {}

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const Plan: React.FC<PlanProps> = () => {
  const currentSubscription = useAppSelector((state) => state.businessSubscription.currentSubscription);
  const is_Active = currentSubscription?.active;
  const subscription = currentSubscription?.subscription_details; 
  const { previousPlan, nextPlan } = useAppSelector(selectAdjacentPlans);

  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription Plan</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your subscription and billing settings.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          {/* Current Plan */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
            <div className="mt-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{subscription?.name || 'Free Plan'}</h3>
                  <p className="text-sm text-gray-500">
                    {is_Active ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ${subscription?.monthly_amount}/month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Navigation */}
          <div className="flex justify-between items-center space-x-4">
            {previousPlan && (
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Previous Plan</h3>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{previousPlan.name}</p>
                      <p className="text-sm text-gray-500">${previousPlan.monthly_amount}/month</p>
                    </div>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {/* Handle downgrade */}}
                    >
                      Downgrade
                    </button>
                  </div>
                </div>
              </div>
            )}

            {nextPlan && (
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Next Plan</h3>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{nextPlan.name}</p>
                      <p className="text-sm text-gray-500">${nextPlan.monthly_amount}/month</p>
                    </div>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {/* Handle upgrade */}}
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Billing Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Billing Information</h2>
            <div className="mt-4 space-y-4">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {/* Handle billing info update */}}
              >
                Update Billing Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Plan;
