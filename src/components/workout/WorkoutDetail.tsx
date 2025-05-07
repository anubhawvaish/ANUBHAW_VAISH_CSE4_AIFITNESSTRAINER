
import React from 'react';
import { Workout } from '@/types/workout';
import { Dumbbell, Activity, ChartBar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WorkoutDetailProps {
  workout: Workout;
  onBackToList: () => void;
  onStart: (workout: Workout) => void;
}

const WorkoutDetail = ({ workout, onBackToList, onStart }: WorkoutDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center">
          <Dumbbell className="mr-2 h-5 w-5 text-fitness-purple" />
          {workout.title}
        </h3>
        <Button variant="outline" onClick={onBackToList}>
          Back to Workouts
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full">
          <Activity className="mr-1 h-4 w-4 text-gray-500" />
          <span>{workout.duration}</span>
        </div>
        <div className="px-3 py-1 bg-gray-100 rounded-full">
          <span className="text-xs font-medium">
            {workout.difficulty}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600">{workout.description}</p>
      
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Exercise</TableHead>
              <TableHead>Sets</TableHead>
              <TableHead>Reps</TableHead>
              <TableHead>Rest</TableHead>
              <TableHead className="hidden md:table-cell">Equipment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workout.exercises.map((exercise, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                      {exercise.illustration ? (
                        <img 
                          src="/placeholder.svg" 
                          alt={exercise.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <ChartBar className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <span>{exercise.name}</span>
                  </div>
                </TableCell>
                <TableCell>{exercise.sets}</TableCell>
                <TableCell>{exercise.reps}</TableCell>
                <TableCell>{exercise.rest}</TableCell>
                <TableCell className="hidden md:table-cell">{exercise.equipment || 'Bodyweight'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Button 
        className="w-full bg-fitness-purple hover:bg-fitness-midPurple"
        onClick={() => onStart(workout)}
      >
        Start Workout
      </Button>
    </div>
  );
};

export default WorkoutDetail;
