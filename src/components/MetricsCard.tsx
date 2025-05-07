
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

interface MetricsCardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  className?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  unit, 
  description,
  className
}) => {
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-fitness-darkBlue">
            {value.toFixed(1)}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};

export const BMICard = () => {
  const { bmi } = useUser();
  
  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obesity';
  };
  
  return (
    <MetricsCard
      title="Body Mass Index (BMI)"
      value={bmi}
      unit="kg/m²"
      description={`Category: ${getBMICategory(bmi)}`}
    />
  );
};

export const BMRCard = () => {
  const { bmr } = useUser();
  
  return (
    <MetricsCard
      title="Basal Metabolic Rate (BMR)"
      value={bmr}
      unit="kcal/day"
      description="Calories burned at complete rest"
    />
  );
};

export const CalorieCard = () => {
  const { dailyCalories, userData } = useUser();
  
  const getCalorieDescription = (): string => {
    switch (userData.goal) {
      case 'lose':
        return 'Target calories for weight loss';
      case 'gain':
        return 'Target calories for weight gain';
      default:
        return 'Target calories for maintenance';
    }
  };
  
  return (
    <MetricsCard
      title="Daily Calorie Target"
      value={dailyCalories}
      unit="kcal"
      description={getCalorieDescription()}
      className="border-fitness-purple"
    />
  );
};
