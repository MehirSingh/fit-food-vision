
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useFood } from '@/context/FoodContext';
import { getMealRecommendations } from '@/services/api';
import { MealRecommendation } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Utensils, Info } from 'lucide-react';

const MealRecommendations = () => {
  const { getRemainingNutrition, dailyGoal, addMeal } = useFood();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<MealRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    if (!user) return;
    
    setLoading(true);
    const remaining = getRemainingNutrition();
    
    try {
      const meals = await getMealRecommendations(
        user.goal,
        remaining.calories,
        remaining.protein,
        remaining.carbs,
        remaining.fat
      );
      
      setRecommendations(meals);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch meal recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddToMeal = (recommendation: MealRecommendation) => {
    // Convert recommendation to food item
    const foodItem = {
      id: recommendation.id,
      name: recommendation.name,
      calories: recommendation.calories,
      protein: recommendation.protein,
      carbs: recommendation.carbs,
      fat: recommendation.fat,
      serving_size: '1 serving',
      image_url: recommendation.imageUrl
    };
    
    addMeal(foodItem, 'lunch', 1);
    toast({
      title: "Meal Added",
      description: `${recommendation.name} has been added to your meals`,
    });
  };

  const remaining = getRemainingNutrition();

  return (
    <>
      <Header />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meal Recommendations</h1>
            <p className="text-muted-foreground">
              Personalized meal suggestions based on your goals and remaining nutrition
            </p>
          </div>

          {/* Nutrition targets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Remaining Nutrition</CardTitle>
              <CardDescription>
                Based on your {user?.goal.replace('_', ' ')} goal and today's consumption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Calories Remaining</p>
                  <p className="text-2xl font-bold">{remaining.calories}</p>
                  <p className="text-xs text-muted-foreground">of {dailyGoal.calories} goal</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Protein Remaining</p>
                  <p className="text-2xl font-bold">{remaining.protein}g</p>
                  <p className="text-xs text-muted-foreground">of {dailyGoal.protein}g goal</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Carbs Remaining</p>
                  <p className="text-2xl font-bold">{remaining.carbs}g</p>
                  <p className="text-xs text-muted-foreground">of {dailyGoal.carbs}g goal</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Fat Remaining</p>
                  <p className="text-2xl font-bold">{remaining.fat}g</p>
                  <p className="text-xs text-muted-foreground">of {dailyGoal.fat}g goal</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={fetchRecommendations}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh Recommendations"}
              </Button>
            </CardFooter>
          </Card>

          <h2 className="text-2xl font-bold mt-6">Suggested Meals</h2>
          
          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Utensils className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No Recommendations Available</h3>
              <p className="text-muted-foreground mt-2">
                We couldn't find meals that match your current nutrition needs.
                Try refreshing or logging some food first.
              </p>
              <Button className="mt-4" onClick={fetchRecommendations}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="overflow-hidden flex flex-col">
                  {recommendation.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={recommendation.imageUrl}
                        alt={recommendation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{recommendation.name}</CardTitle>
                    <CardDescription>{recommendation.calories} calories</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-center">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Protein</p>
                        <p className="text-lg">{recommendation.protein}g</p>
                      </div>
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-md text-center">
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Carbs</p>
                        <p className="text-lg">{recommendation.carbs}g</p>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-center">
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">Fat</p>
                        <p className="text-lg">{recommendation.fat}g</p>
                      </div>
                    </div>
                    
                    {recommendation.recipe && (
                      <div className="mt-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <Info className="h-4 w-4" />
                          <span>Recipe</span>
                        </div>
                        <p className="text-sm">{recommendation.recipe}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleAddToMeal(recommendation)}
                    >
                      Add to My Meals
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MealRecommendations;
