
import React from 'react';
import ExerciseFormAnalysis from '@/components/ExerciseFormAnalysis';
import { CheckCircle } from 'lucide-react';

const Analysis = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-fitness-darkBlue">Exercise Form Analysis</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          How It Works
        </h2>
        <p className="text-gray-600 mb-3">
          Our AI-powered exercise form analysis uses your webcam to provide real-time feedback on your movements.
          Follow these steps:
        </p>
        
        <ol className="list-decimal pl-5 space-y-1 text-gray-600">
          <li>Select an exercise from the dropdown menu</li>
          <li>Review the proper form instructions before starting</li>
          <li>Click "Start Analysis" and allow camera access</li>
          <li>Begin performing the exercise with consistent motion</li>
          <li>Receive personalized form corrections as you exercise</li>
        </ol>
        
        <p className="text-sm text-gray-500 mt-3 italic">
          For best results, position yourself so your full body is visible in the camera frame.
        </p>
      </div>
      
      <ExerciseFormAnalysis />
    </div>
  );
};

export default Analysis;
