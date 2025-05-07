import React, { useState, useEffect } from 'react';
import { Workout, Exercise } from '@/types/workout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartBar, ChevronLeft, ChevronRight, CheckCircle, Timer, Dumbbell, Flame } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import confetti from 'canvas-confetti';

interface WorkoutInProgressProps {
  workout: Workout;
  onComplete: () => void;
  onCancel: () => void;
}

const WorkoutInProgress = ({ workout, onComplete, onCancel }: WorkoutInProgressProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, number>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { toast } = useToast();
  const { logWorkoutCompletion } = useUser();
  
  const currentExercise = workout.exercises[currentExerciseIndex];
  const isFirstExercise = currentExerciseIndex === 0;
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  
  const completedSetsForCurrentExercise = completedSets[currentExerciseIndex] || 0;
  const isExerciseComplete = completedSetsForCurrentExercise >= currentExercise.sets;
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handlePrevious = () => {
    if (!isFirstExercise) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (!isLastExercise) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };
  
  const handleCompleteSet = () => {
    const updatedSets = completedSets[currentExerciseIndex] || 0;
    const newCompletedSets = { ...completedSets, [currentExerciseIndex]: updatedSets + 1 };
    setCompletedSets(newCompletedSets);
    
    const newSetCount = newCompletedSets[currentExerciseIndex];
    
    if (newSetCount === currentExercise.sets) {
      toast({
        title: "Exercise completed!",
        description: `You've completed all sets for ${currentExercise.name}`,
      });
      
      // Auto advance to next exercise after a short delay
      if (!isLastExercise) {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    }
  };
  
  const calculateCaloriesBurned = (): number => {
    // Simple estimation based on workout difficulty and time
    const difficultyMultiplier = workout.difficulty === 'beginner' ? 3 : 
                                workout.difficulty === 'intermediate' ? 5 : 7;
    return Math.round((timeElapsed / 60) * difficultyMultiplier);
  };
  
  const handleCompleteWorkout = () => {
    const caloriesBurned = calculateCaloriesBurned();
    
    // Trigger confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    toast({
      title: "🎉 Workout completed!",
      description: `Great job! You've burned approximately ${caloriesBurned} calories.`,
      variant: "default",
    });
    
    logWorkoutCompletion(caloriesBurned);
    onComplete();
  };
  
  const isWorkoutComplete = Object.keys(completedSets).length === workout.exercises.length &&
    workout.exercises.every((_, index) => (completedSets[index] || 0) >= workout.exercises[index].sets);
  
  // Calculate overall progress percentage
  const calculateProgress = (): number => {
    const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets, 0);
    const completedSetsTotal = Object.values(completedSets).reduce((total, sets) => total + sets, 0);
    return Math.round((completedSetsTotal / totalSets) * 100);
  };
  
  const renderExerciseContent = (exercise: Exercise) => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <motion.div 
          className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center"
          animate={{ rotate: isExerciseComplete ? [0, -10, 10, -10, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          {exercise.illustration ? (
            <img 
              src="/placeholder.svg" 
              alt={exercise.name}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <ChartBar className="w-8 h-8 text-gray-400" />
          )}
        </motion.div>
        <div>
          <h3 className="text-xl font-medium">{exercise.name}</h3>
          <p className="text-gray-500">{exercise.equipment || 'Bodyweight'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Sets</p>
          <p className="text-lg font-medium">
            {completedSetsForCurrentExercise} / {exercise.sets}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Reps</p>
          <p className="text-lg font-medium">{exercise.reps}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Rest</p>
          <div className="flex items-center">
            <Timer className="w-4 h-4 mr-1 text-gray-500" />
            <p className="text-lg font-medium">{exercise.rest}</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Progress</p>
          <p className="text-lg font-medium">
            {currentExerciseIndex + 1} / {workout.exercises.length}
          </p>
        </div>
      </div>
      
      {isExerciseComplete ? (
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center p-4 bg-green-50 rounded-lg"
        >
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <p className="text-green-700 font-medium">All sets completed!</p>
        </motion.div>
      ) : (
        <Button 
          onClick={handleCompleteSet}
          className="w-full bg-fitness-purple hover:bg-fitness-midPurple"
        >
          Complete Set {completedSetsForCurrentExercise + 1}
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Dumbbell className="mr-2 h-6 w-6 text-fitness-purple" />
          {workout.title}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm flex items-center">
            <Flame className="w-4 h-4 mr-1 text-orange-500" />
            <span>{calculateCaloriesBurned()} kcal</span>
          </div>
          <div className="text-sm flex items-center">
            <Timer className="w-4 h-4 mr-1 text-blue-500" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <Button variant="outline" onClick={onCancel} size="sm">
            Exit
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Exercise {currentExerciseIndex + 1} of {workout.exercises.length}</span>
            <span className="text-sm text-gray-500">Overall: {calculateProgress()}% complete</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="h-2 mb-4" />
          {renderExerciseContent(currentExercise)}
        </CardContent>
      </Card>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={isFirstExercise}
          className="flex-1"
        >
          <ChevronLeft className="mr-1" /> Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={handleNext}
          disabled={isLastExercise}
          className="flex-1"
        >
          Next <ChevronRight className="ml-1" />
        </Button>
      </div>
      
      {isWorkoutComplete && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleCompleteWorkout}
          >
            <CheckCircle className="mr-2" /> Complete Workout
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default WorkoutInProgress;
