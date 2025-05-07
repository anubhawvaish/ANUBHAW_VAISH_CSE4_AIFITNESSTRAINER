
import React from 'react';
import { Workout } from '@/types/workout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Activity, ChartBar, Calendar } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onViewDetails: (workout: Workout) => void;
  onStart: (workout: Workout) => void;
}

const WorkoutCard = ({ workout, onViewDetails, onStart }: WorkoutCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-fitness-purple" />
              {workout.title}
            </CardTitle>
            <CardDescription className="mt-1">{workout.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mb-4">
          <div className="flex items-center">
            <Activity className="mr-1 h-4 w-4 text-gray-500" />
            <span>{workout.duration}</span>
          </div>

          <div className="flex gap-2">
            {workout.day && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3 text-fitness-purple" />
                <span className="text-xs">{workout.day}</span>
              </div>
            )}
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
              {workout.difficulty}
            </span>
          </div>
        </div>

        {workout.focus && (
          <div className="bg-fitness-purple bg-opacity-10 text-fitness-darkBlue rounded-md px-2 py-1 text-xs mb-4 inline-block">
            {workout.focus}
          </div>
        )}
        
        <div className="space-y-3 mb-4">
          {workout.exercises.slice(0, 3).map((exercise, idx) => (
            <div key={idx} className="flex justify-between text-sm border-b pb-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-100 rounded-md mr-2 flex items-center justify-center">
                  {exercise.illustration ? (
                    <img 
                      src={`/placeholder.svg`} 
                      alt={exercise.name}
                      className="w-4 h-4 object-contain"
                    />
                  ) : (
                    <ChartBar className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <span>{exercise.name}</span>
              </div>
              <span className="text-gray-500">
                {exercise.sets} × {exercise.reps}
              </span>
            </div>
          ))}
          
          {workout.exercises.length > 3 && (
            <div className="text-sm text-center text-gray-500">
              +{workout.exercises.length - 3} more exercises
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails(workout)}
          >
            View Details
          </Button>
          <Button 
            className="flex-1 bg-fitness-purple hover:bg-fitness-midPurple"
            onClick={() => onStart(workout)}
          >
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
