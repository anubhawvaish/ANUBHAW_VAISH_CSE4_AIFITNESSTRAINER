
import React from 'react';
import WorkoutRecommendation from '@/components/WorkoutRecommendation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { getRecommendedWorkouts } from '@/utils/workoutUtils';
import { CalendarDays, Dumbbell } from 'lucide-react';

const Workouts = () => {
  const { userData, bmi } = useUser();
  const workouts = getRecommendedWorkouts(bmi, userData.age, userData.goal);
  
  // Define weekdays in order
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Extract days from workouts and ensure they match our defined order
  const days = weekdays.filter(day => workouts.some(workout => workout.day === day));
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-fitness-darkBlue flex items-center">
          <Dumbbell className="mr-2 h-7 w-7 text-fitness-purple" />
          Weekly Workout Plan
        </h1>
        <p className="text-gray-600">
          Your personalized 7-day workout routine based on your fitness goals, body metrics, and experience level.
          Follow this plan for optimal results with proper form guidance.
        </p>
      </div>
      
      {days.length > 0 ? (
        <>
          <div className="flex items-center mb-4">
            <CalendarDays className="h-5 w-5 text-fitness-purple mr-2" />
            <h2 className="text-xl font-medium">Weekly Schedule</h2>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4 overflow-auto">
              <TabsTrigger value="all">All Workouts</TabsTrigger>
              {days.map(day => (
                <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all">
              <WorkoutRecommendation />
            </TabsContent>
            
            {days.map(day => (
              <TabsContent key={day} value={day}>
                <WorkoutRecommendation filterDay={day} />
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <WorkoutRecommendation />
      )}
    </div>
  );
};

export default Workouts;
