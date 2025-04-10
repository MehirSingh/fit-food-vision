
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';

const ProfileSetup = () => {
  const { user, updateUserProfile } = useAuth();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateTDEE = (age: number, weight: number, height: number, activityLevel: string, gender: string = 'male') => {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multiplier
    let activityMultiplier;
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'light':
        activityMultiplier = 1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'very_active':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }

    return Math.round(bmr * activityMultiplier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!age || !weight || !height || !activityLevel) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseInt(weight);
    const heightNum = parseInt(height);
    
    // Calculate TDEE
    const tdee = calculateTDEE(ageNum, weightNum, heightNum, activityLevel);
    
    // Update user profile
    updateUserProfile({
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      activityLevel: activityLevel as any,
      tdee
    });
    
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">Complete Your Profile</CardTitle>
          <CardDescription>Help us personalize your nutrition recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number"
                placeholder="Age in years" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number"
                placeholder="Weight in kilograms" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input 
                id="height" 
                type="number"
                placeholder="Height in centimeters" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activity-level">Activity Level</Label>
              <Select onValueChange={setActivityLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (intense exercise daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-6" type="submit">
              Complete Profile
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            This information helps us provide accurate nutrition recommendations
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;
