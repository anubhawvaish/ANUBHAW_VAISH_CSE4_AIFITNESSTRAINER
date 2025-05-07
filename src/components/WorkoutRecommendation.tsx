
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Workout } from '@/types/workout';
import { getRecommendedWorkouts } from '@/utils/workoutUtils';
import WorkoutList from './workout/WorkoutList';
import WorkoutDetail from './workout/WorkoutDetail';
import WorkoutInProgress from './workout/WorkoutInProgress';

interface WorkoutRecommendationProps {
  filterDay?: string;
}

const WorkoutRecommendation = ({ filterDay }: WorkoutRecommendationProps) => {
  const { userData, bmi } = useUser();
  const allWorkouts = getRecommendedWorkouts(bmi, userData.age, userData.goal);
  
  // Filter workouts by day if filterDay is provided
  const workouts = filterDay 
    ? allWorkouts.filter(workout => workout.day === filterDay)
    : allWorkouts;
  
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  
  const handleViewDetails = (workout: Workout) => {
    setSelectedWorkout(workout);
  };
  
  const handleBackToList = () => {
    setSelectedWorkout(null);
  };
  
  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setSelectedWorkout(null);
  };
  
  const handleCompleteWorkout = () => {
    setActiveWorkout(null);
  };
  
  const handleCancelWorkout = () => {
    if (confirm('Are you sure you want to exit the current workout?')) {
      setActiveWorkout(null);
    }
  };
  
  return (
    <div className="space-y-6">
      {!filterDay && (
        <h2 className="text-2xl font-bold">Recommended Workouts</h2>
      )}
      
      {!filterDay && (
        <p className="text-gray-500">
          Based on your profile, here are some workouts tailored to your goals and fitness level.
        </p>
      )}
      
      {activeWorkout ? (
        <WorkoutInProgress 
          workout={activeWorkout}
          onComplete={handleCompleteWorkout}
          onCancel={handleCancelWorkout}
        />
      ) : selectedWorkout ? (
        <WorkoutDetail 
          workout={selectedWorkout}
          onBackToList={handleBackToList}
          onStart={handleStartWorkout}
        />
      ) : (
        <WorkoutList 
          workouts={workouts}
          onViewDetails={handleViewDetails}
          onStart={handleStartWorkout}
        />
      )}
    </div>
  );
};

export default WorkoutRecommendation;
