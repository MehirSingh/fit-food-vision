
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { FitnessGoal } from '@/types';

const Profile = () => {
  const { user, updateUserProfile, updateUserGoal } = useAuth();
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'moderate');
  const [goal, setGoal] = useState<FitnessGoal>(user?.goal || 'maintenance');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

    setLoading(true);
    
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
    
    // Update goal if changed
    if (goal !== user?.goal) {
      updateUserGoal(goal);
    }
    
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Profile</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={user?.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email} disabled />
                </div>
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
                  <Select 
                    value={activityLevel} 
                    onValueChange={(value) => setActivityLevel(value)}
                  >
                    <SelectTrigger id="activity-level">
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
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Updating Profile..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fitness Goals</CardTitle>
              <CardDescription>Update your goals and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fitness Goal</Label>
                <RadioGroup defaultValue={goal} onValueChange={(value) => setGoal(value as FitnessGoal)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weight_loss" id="weight_loss" />
                    <Label htmlFor="weight_loss">Weight Loss</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                    <Label htmlFor="muscle_gain">Muscle Gain</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintenance" id="maintenance" />
                    <Label htmlFor="maintenance">Maintenance</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Daily Calorie Goal</Label>
                <div className="text-2xl font-bold">
                  {user?.tdee || 'Calculate first'}
                  <span className="text-sm font-normal text-muted-foreground ml-2">calories/day</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your physical details and activity level
                </p>
              </div>

              {user?.goal === 'weight_loss' && (
                <Card className="bg-muted border-none">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Weight Loss Recommendations</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Focus on protein-rich foods to maintain muscle mass</li>
                      <li>• Target 500 calories deficit from your TDEE</li>
                      <li>• Include regular strength training in your routine</li>
                      <li>• Stay hydrated with at least 8 glasses of water daily</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {user?.goal === 'muscle_gain' && (
                <Card className="bg-muted border-none">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Muscle Gain Recommendations</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Consume 250-500 calories above your TDEE</li>
                      <li>• Target 1.6-2.2g of protein per kg of bodyweight</li>
                      <li>• Focus on progressive overload during training</li>
                      <li>• Get 7-9 hours of quality sleep for recovery</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {user?.goal === 'maintenance' && (
                <Card className="bg-muted border-none">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Maintenance Recommendations</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Consume your TDEE in calories daily</li>
                      <li>• Balanced macronutrient ratio for overall health</li>
                      <li>• Mix of strength and cardio exercise</li>
                      <li>• Focus on nutrient-dense whole foods</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Profile;
