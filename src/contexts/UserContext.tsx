
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very';
  workoutsCompleted: number;
  caloriesBurned: number;
  streak: number;
  lastActive: string | null;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  bmi: number;
  bmr: number;
  dailyCalories: number;
  updateStreak: () => void;
  logWorkoutCompletion: (caloriesBurned: number) => void;
}

const initialUserData: UserData = {
  name: '',
  age: 30,
  height: 170, // cm
  weight: 70, // kg
  gender: 'male',
  goal: 'maintain',
  activityLevel: 'moderate',
  workoutsCompleted: 0,
  caloriesBurned: 0,
  streak: 0,
  lastActive: null,
};

// BMI calculation function
const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// BMR calculation using Mifflin-St Jeor Equation
const calculateBMR = (userData: UserData): number => {
  const { age, height, weight, gender } = userData;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Daily calorie needs based on activity level and goal
const calculateDailyCalories = (bmr: number, activityLevel: string, goal: string): number => {
  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very: 1.9,
  };
  
  // Calculate maintenance calories
  const maintenanceCalories = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];
  
  // Adjust based on goal
  switch (goal) {
    case 'lose':
      return Math.round(maintenanceCalories - 500); // 500 calorie deficit
    case 'gain':
      return Math.round(maintenanceCalories + 500); // 500 calorie surplus
    default:
      return Math.round(maintenanceCalories); // maintenance
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    // Load user data from localStorage on initial render
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : initialUserData;
  });
  
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);
  
  // Calculate metrics
  const bmi = calculateBMI(userData.height, userData.weight);
  const bmr = calculateBMR(userData);
  const dailyCalories = calculateDailyCalories(bmr, userData.activityLevel, userData.goal);
  
  // Update user streak based on daily activity
  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (userData.lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // If user was active yesterday, increment streak, otherwise reset to 1
      const newStreak = userData.lastActive === yesterdayStr ? userData.streak + 1 : 1;
      
      setUserData(prev => ({
        ...prev,
        streak: newStreak,
        lastActive: today,
      }));
    }
  };
  
  // Log workout completion
  const logWorkoutCompletion = (caloriesBurned: number) => {
    setUserData(prev => ({
      ...prev,
      workoutsCompleted: prev.workoutsCompleted + 1,
      caloriesBurned: prev.caloriesBurned + caloriesBurned,
    }));
    updateStreak();
  };
  
  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };
  
  return (
    <UserContext.Provider
      value={{
        userData,
        updateUserData,
        bmi,
        bmr,
        dailyCalories,
        updateStreak,
        logWorkoutCompletion,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
