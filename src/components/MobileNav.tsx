
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, HeartPulse, Dumbbell, Camera, CircleUser } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: Activity,
    },
    {
      label: 'Nutrition',
      path: '/nutrition',
      icon: HeartPulse,
    },
    {
      label: 'Workouts',
      path: '/workouts',
      icon: Dumbbell,
    },
    {
      label: 'Analysis',
      path: '/analysis',
      icon: Camera,
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: CircleUser,
    },
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center py-2 px-3',
              location.pathname === item.path ? 'text-fitness-purple' : 'text-gray-500'
            )}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
