
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BMICard, BMRCard, CalorieCard } from '@/components/MetricsCard';
import { Progress } from '@/components/ui/progress';
import { Activity, Dumbbell, HeartPulse, Timer } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const DashboardSummary = () => {
  const { userData } = useUser();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-fitness-darkBlue">
          {userData.name ? `Welcome back, ${userData.name}` : 'Welcome to BodySmart'}
        </h1>
        <p className="text-gray-500 mt-1">
          {userData.name ? 'Your fitness journey is on track.' : 'Complete your profile to get personalized recommendations.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BMICard />
        <BMRCard />
        <CalorieCard />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium flex items-center mb-4">
              <Activity className="mr-2 h-5 w-5 text-fitness-purple" />
              Today's Progress
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Steps</span>
                  <span className="text-gray-500">5,430 / 10,000</span>
                </div>
                <Progress value={54} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Water</span>
                  <span className="text-gray-500">4 / 8 glasses</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calories consumed</span>
                  <span className="text-gray-500">1,200 / 2,200 kcal</span>
                </div>
                <Progress value={55} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium flex items-center mb-4">
              <HeartPulse className="mr-2 h-5 w-5 text-fitness-purple" />
              This Week's Activity
            </h3>
            
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center">
                  <div className="mb-1">{day}</div>
                  <div 
                    className={`h-20 rounded-md ${i <= 3 ? 'bg-fitness-purple bg-opacity-' + (20 + i * 20) : 'bg-gray-100'}`}
                    title={`${i <= 3 ? `${(i+1) * 20} minutes activity` : 'No activity yet'}`}
                  ></div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-medium">4</div>
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Dumbbell className="mr-1 h-3 w-3" />
                  Workouts
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-medium">120</div>
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Timer className="mr-1 h-3 w-3" />
                  Minutes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSummary;
