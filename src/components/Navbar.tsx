
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const { userData } = useUser();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full fitness-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">FT</span>
          </div>
          <Link to="/" className="font-bold text-lg text-fitness-darkBlue">
            Fitness Trainer
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-fitness-purple transition-colors">
            Dashboard
          </Link>
          <Link to="/nutrition" className="text-gray-700 hover:text-fitness-purple transition-colors">
            Nutrition
          </Link>
          <Link to="/workouts" className="text-gray-700 hover:text-fitness-purple transition-colors">
            Workouts
          </Link>
          <Link to="/analysis" className="text-gray-700 hover:text-fitness-purple transition-colors">
            Form Analysis
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-fitness-purple transition-colors">
            Profile
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="hidden md:flex items-center space-x-2 text-sm font-medium"
          >
            {userData.name ? (
              <span>{userData.name}</span>
            ) : (
              <span>Set Up Profile</span>
            )}
          </Button>
          
          <Button className="bg-fitness-purple hover:bg-fitness-midPurple text-white">
            <Link to={userData.name ? "/workouts" : "/profile"}>
              {userData.name ? "Start Workout" : "Get Started"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
