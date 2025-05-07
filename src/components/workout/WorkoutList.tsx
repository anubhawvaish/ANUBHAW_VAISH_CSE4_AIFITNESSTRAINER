
import React from 'react';
import { Workout } from '@/types/workout';
import WorkoutCard from './WorkoutCard';
import { motion } from 'framer-motion';

interface WorkoutListProps {
  workouts: Workout[];
  onViewDetails: (workout: Workout) => void;
  onStart: (workout: Workout) => void;
}

const WorkoutList = ({ workouts, onViewDetails, onStart }: WorkoutListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {workouts.map((workout, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="h-full"
        >
          <WorkoutCard 
            workout={workout}
            onViewDetails={onViewDetails}
            onStart={onStart}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default WorkoutList;
