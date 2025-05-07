
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MessageCircle } from 'lucide-react';

const ProfileForm = () => {
  const { userData, updateUserData } = useUser();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personal Profile</CardTitle>
        <CardDescription>
          Enter your details for personalized fitness and nutrition recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => updateUserData({ name: e.target.value })}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={userData.age}
                  onChange={(e) => updateUserData({ age: parseInt(e.target.value, 10) || 0 })}
                  placeholder="Enter your age"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={userData.gender}
                  onValueChange={(value) => updateUserData({ gender: value as any })}
                >
                  <SelectTrigger id="gender" className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="height">Height (cm): {userData.height}</Label>
              </div>
              <Slider
                id="height"
                min={100}
                max={250}
                step={1}
                value={[userData.height]}
                onValueChange={(value) => updateUserData({ height: value[0] })}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="weight">Weight (kg): {userData.weight}</Label>
              </div>
              <Slider
                id="weight"
                min={30}
                max={200}
                step={0.5}
                value={[userData.weight]}
                onValueChange={(value) => updateUserData({ weight: value[0] })}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select
                value={userData.goal}
                onValueChange={(value) => updateUserData({ goal: value as any })}
              >
                <SelectTrigger id="goal" className="mt-1">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight/Muscle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select
                value={userData.activityLevel}
                onValueChange={(value) => updateUserData({ activityLevel: value as any })}
              >
                <SelectTrigger id="activityLevel" className="mt-1">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                  <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Very active (hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="very">Extremely active (very hard exercise, physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-fitness-purple hover:bg-fitness-midPurple">
            Save Profile
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center">
          <MessageCircle size={16} className="mr-1" />
          Need help? Use the fitness assistant bot in the bottom right corner!
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
