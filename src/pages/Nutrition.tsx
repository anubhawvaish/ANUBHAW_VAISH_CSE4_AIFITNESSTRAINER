
import React from 'react';
import FoodCalorieTracker from '@/components/FoodCalorieTracker';
import { CalorieCard } from '@/components/MetricsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Drumstick, Utensils } from 'lucide-react';

const Nutrition = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-fitness-darkBlue">Nutrition Tracking</h1>
      
      <div className="max-w-xs mb-6">
        <CalorieCard />
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Apple className="mr-2 h-5 w-5 text-fitness-purple" />
              Indian Cuisine Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Rich in anti-inflammatory spices like turmeric and ginger</li>
              <li>High-protein options with lentils (dal) and paneer</li>
              <li>Complex carbs from whole grains like brown rice and millet</li>
              <li>Variety of vegetables in dishes like palak paneer and mixed veg curry</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Drumstick className="mr-2 h-5 w-5 text-fitness-purple" />
              Protein Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Paneer: 18g protein per 100g serving</li>
              <li>Dal: 9g protein per 100g serving</li>
              <li>Chicken Curry: 19g protein per 100g serving</li>
              <li>Yogurt/Raita: 3.5g protein per 100g serving</li>
              <li>Chickpeas (Chana): 7g protein per 100g serving</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Utensils className="mr-2 h-5 w-5 text-fitness-purple" />
              Meal Balancing Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Pair rice dishes with protein-rich dal for complete proteins</li>
              <li>Choose tandoori preparations over fried options</li>
              <li>Use raita as a low-calorie side dish</li>
              <li>Opt for chapati over naan to reduce calories</li>
              <li>Include vegetable dishes to increase fiber intake</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <FoodCalorieTracker />
    </div>
  );
};

export default Nutrition;
