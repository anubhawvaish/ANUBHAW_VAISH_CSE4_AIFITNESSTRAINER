
import React from 'react';
import DashboardSummary from '@/components/DashboardSummary';
import WorkoutRecommendation from '@/components/WorkoutRecommendation';
import UserAchievements from '@/components/UserAchievements';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { userData } = useUser();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardSummary />
      </motion.div>
      
      {userData.name && (
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <UserAchievements />
        </motion.div>
      )}
      
      <motion.div 
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {userData.name ? (
          <WorkoutRecommendation />
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Complete Your Profile</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Set up your profile to get personalized workout recommendations, calorie targets, and fitness insights.
            </p>
            <Button asChild>
              <Link to="/profile">Set Up Profile</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
