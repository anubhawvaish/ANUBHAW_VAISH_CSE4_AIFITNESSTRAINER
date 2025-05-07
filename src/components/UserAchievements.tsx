
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Flame, Calendar, Dumbbell } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const UserAchievements = () => {
  const { userData } = useUser();
  
  // Some milestone goals
  const workoutMilestone = 10;
  const caloriesMilestone = 1000;
  const streakMilestone = 7;
  
  const workoutProgress = Math.min(100, (userData.workoutsCompleted / workoutMilestone) * 100);
  const calorieProgress = Math.min(100, (userData.caloriesBurned / caloriesMilestone) * 100);
  const streakProgress = Math.min(100, (userData.streak / streakMilestone) * 100);
  
  const achievements = [
    {
      title: 'Workouts',
      icon: <Dumbbell className="h-5 w-5 text-green-500" />,
      current: userData.workoutsCompleted,
      target: workoutMilestone,
      progress: workoutProgress,
      color: 'bg-green-500'
    },
    {
      title: 'Calories Burned',
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      current: userData.caloriesBurned,
      target: caloriesMilestone,
      progress: calorieProgress,
      color: 'bg-orange-500'
    },
    {
      title: 'Streak',
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      current: userData.streak,
      target: streakMilestone,
      progress: streakProgress,
      color: 'bg-blue-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Your Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {achievement.icon}
                  <span className="ml-2 text-sm font-medium">{achievement.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {achievement.current} / {achievement.target}
                </span>
              </div>
              <div className="relative">
                <Progress value={achievement.progress} className={`h-2 ${achievement.color}`} />
                {achievement.progress >= 100 && (
                  <div className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 2
                      }}
                    >
                      <span className="text-lg">🎉</span>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {userData.workoutsCompleted === 0 && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Complete workouts to earn achievements and track your progress!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserAchievements;
