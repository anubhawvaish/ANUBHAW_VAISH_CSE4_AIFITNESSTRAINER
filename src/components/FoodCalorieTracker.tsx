
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { HeartPulse, Utensils, Apple, Drumstick } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const FOOD_DATABASE: FoodItem[] = [
  { id: '1', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: '2', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: '3', name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: '4', name: 'Egg', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { id: '5', name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { id: '6', name: 'Rice (100g, cooked)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: '7', name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  { id: '8', name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: '9', name: 'Oatmeal (100g, cooked)', calories: 71, protein: 2.5, carbs: 12, fat: 1.5 },
  { id: '10', name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  // Indian Food Items
  { id: '11', name: 'Dal (100g)', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { id: '12', name: 'Chicken Curry (100g)', calories: 190, protein: 19, carbs: 5, fat: 12 },
  { id: '13', name: 'Paneer (100g)', calories: 265, protein: 18.3, carbs: 3.4, fat: 20.8 },
  { id: '14', name: 'Chapati (1 piece)', calories: 104, protein: 3, carbs: 17, fat: 3 },
  { id: '15', name: 'Basmati Rice (100g, cooked)', calories: 121, protein: 2.7, carbs: 25.2, fat: 0.3 },
  { id: '16', name: 'Butter Chicken (100g)', calories: 230, protein: 15, carbs: 7, fat: 17 },
  { id: '17', name: 'Samosa (1 piece)', calories: 262, protein: 3.5, carbs: 30, fat: 14 },
  { id: '18', name: 'Palak Paneer (100g)', calories: 180, protein: 11, carbs: 6, fat: 13 },
  { id: '19', name: 'Biryani (100g)', calories: 185, protein: 9, carbs: 22, fat: 7 },
  { id: '20', name: 'Raita (100g)', calories: 76, protein: 3.5, carbs: 6, fat: 4.2 },
];

interface ConsumedFood extends FoodItem {
  quantity: number;
}

const FoodCalorieTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [consumedFoods, setConsumedFoods] = useState<ConsumedFood[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const { toast } = useToast();
  const { dailyCalories } = useUser();
  
  const filteredFoods = FOOD_DATABASE.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddFood = () => {
    if (selectedFood) {
      const existingFoodIndex = consumedFoods.findIndex(
        (food) => food.id === selectedFood.id
      );
      
      if (existingFoodIndex !== -1) {
        // Update quantity of existing food
        const updatedFoods = [...consumedFoods];
        updatedFoods[existingFoodIndex].quantity += quantity;
        setConsumedFoods(updatedFoods);
      } else {
        // Add new food
        setConsumedFoods([
          ...consumedFoods,
          { ...selectedFood, quantity },
        ]);
      }
      
      toast({
        title: 'Food added',
        description: `Added ${quantity} ${quantity === 1 ? 'serving' : 'servings'} of ${selectedFood.name}`,
      });
      
      // Reset selection
      setSelectedFood(null);
      setQuantity(1);
      setSearchTerm('');
    }
  };
  
  const handleRemoveFood = (id: string) => {
    setConsumedFoods(consumedFoods.filter((food) => food.id !== id));
  };
  
  const totalCalories = consumedFoods.reduce(
    (sum, food) => sum + food.calories * food.quantity,
    0
  );
  
  const totalProtein = consumedFoods.reduce(
    (sum, food) => sum + food.protein * food.quantity,
    0
  );
  
  const totalCarbs = consumedFoods.reduce(
    (sum, food) => sum + food.carbs * food.quantity,
    0
  );
  
  const totalFat = consumedFoods.reduce(
    (sum, food) => sum + food.fat * food.quantity,
    0
  );
  
  const caloriePercentage = Math.min(Math.round((totalCalories / dailyCalories) * 100), 100);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2 h-5 w-5 text-fitness-purple" />
              Food Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="food-search">Search Food</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="food-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for food..."
                  className="flex-1"
                />
              </div>
            </div>
            
            {searchTerm && filteredFoods.length > 0 && !selectedFood && (
              <div className="border rounded-md max-h-40 overflow-auto">
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b flex justify-between"
                  >
                    <span>{food.name}</span>
                    <span className="text-gray-500">{food.calories} cal</span>
                  </div>
                ))}
              </div>
            )}
            
            {selectedFood && (
              <div className="border rounded-md p-3 space-y-3 bg-gray-50">
                <div className="flex justify-between">
                  <span className="font-medium">{selectedFood.name}</span>
                  <span>{selectedFood.calories} cal per serving</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-500">
                  <div>Protein: {selectedFood.protein}g</div>
                  <div>Carbs: {selectedFood.carbs}g</div>
                  <div>Fat: {selectedFood.fat}g</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="quantity" className="whitespace-nowrap">
                    Quantity:
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16"
                  />
                  <Button onClick={handleAddFood} className="ml-auto">
                    Add
                  </Button>
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Today's Food</h3>
              {consumedFoods.length === 0 ? (
                <p className="text-gray-500 text-sm">No foods added yet today</p>
              ) : (
                <div className="space-y-2">
                  {consumedFoods.map((food) => (
                    <div key={food.id} className="flex justify-between items-center">
                      <div>
                        <span>
                          {food.quantity} × {food.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">
                          {food.calories * food.quantity} cal
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFood(food.id)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HeartPulse className="mr-2 h-5 w-5 text-fitness-purple" />
              Nutrition Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Daily Calories</h3>
                <div>
                  <span className="font-bold">{totalCalories}</span>
                  <span className="text-gray-500"> / {dailyCalories} kcal</span>
                </div>
              </div>
              <Progress value={caloriePercentage} className="h-2.5" />
              <p className="text-sm text-gray-500 mt-1">
                {caloriePercentage}% of daily goal
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-bold">{Math.round(totalProtein)}g</div>
                <div className="text-xs text-gray-500">Protein</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-bold">{Math.round(totalCarbs)}g</div>
                <div className="text-xs text-gray-500">Carbs</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-bold">{Math.round(totalFat)}g</div>
                <div className="text-xs text-gray-500">Fat</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Nutrient Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Protein ({Math.round((totalProtein * 4 / totalCalories) * 100) || 0}%)</span>
                    <span className="text-gray-500">{Math.round(totalProtein * 4)} kcal</span>
                  </div>
                  <Progress value={(totalProtein * 4 / totalCalories) * 100 || 0} className="h-1.5 bg-gray-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carbs ({Math.round((totalCarbs * 4 / totalCalories) * 100) || 0}%)</span>
                    <span className="text-gray-500">{Math.round(totalCarbs * 4)} kcal</span>
                  </div>
                  <Progress value={(totalCarbs * 4 / totalCalories) * 100 || 0} className="h-1.5 bg-gray-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fat ({Math.round((totalFat * 9 / totalCalories) * 100) || 0}%)</span>
                    <span className="text-gray-500">{Math.round(totalFat * 9)} kcal</span>
                  </div>
                  <Progress value={(totalFat * 9 / totalCalories) * 100 || 0} className="h-1.5 bg-gray-100" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoodCalorieTracker;
