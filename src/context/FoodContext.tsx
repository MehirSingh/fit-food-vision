
import React, { createContext, useState, useContext, useEffect } from 'react';
import { FoodItem, MealEntry, NutritionSummary } from '../types';
import { useAuth } from './AuthContext';

interface FoodContextType {
  meals: MealEntry[];
  addMeal: (foodItem: FoodItem, mealType: MealEntry['mealType'], servings: number) => void;
  removeMeal: (mealId: string) => void;
  dailySummary: NutritionSummary;
  dailyGoal: NutritionSummary;
  getRemainingNutrition: () => NutritionSummary;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const useFood = () => {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
};

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [dailySummary, setDailySummary] = useState<NutritionSummary>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [dailyGoal, setDailyGoal] = useState<NutritionSummary>({
    calories: 2000, // Default values
    protein: 150,
    carbs: 200,
    fat: 65
  });

  // Load saved meals from localStorage
  useEffect(() => {
    if (user) {
      const storedMeals = localStorage.getItem(`meals-${user.id}`);
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }

      // Set daily goals based on user's info
      if (user.tdee) {
        let proteinGoal, carbsGoal, fatGoal;

        switch (user.goal) {
          case 'muscle_gain':
            proteinGoal = user.weight ? user.weight * 2.2 : 150;  // 2.2g per kg of bodyweight
            carbsGoal = user.tdee * 0.5 / 4;  // 50% of calories from carbs
            fatGoal = user.tdee * 0.25 / 9;   // 25% of calories from fat
            break;
          case 'weight_loss':
            proteinGoal = user.weight ? user.weight * 2 : 120;  // 2g per kg of bodyweight
            carbsGoal = user.tdee * 0.4 / 4;  // 40% of calories from carbs
            fatGoal = user.tdee * 0.3 / 9;    // 30% of calories from fat
            break;
          default: // maintenance
            proteinGoal = user.weight ? user.weight * 1.8 : 130;  // 1.8g per kg of bodyweight
            carbsGoal = user.tdee * 0.45 / 4;  // 45% of calories from carbs
            fatGoal = user.tdee * 0.3 / 9;     // 30% of calories from fat
        }

        setDailyGoal({
          calories: user.tdee,
          protein: Math.round(proteinGoal),
          carbs: Math.round(carbsGoal),
          fat: Math.round(fatGoal)
        });
      }
    }
  }, [user]);

  // Update daily summary when meals change
  useEffect(() => {
    if (meals.length > 0) {
      const summary: NutritionSummary = meals.reduce(
        (acc, meal) => {
          return {
            calories: acc.calories + (meal.food.calories * meal.servings),
            protein: acc.protein + (meal.food.protein * meal.servings),
            carbs: acc.carbs + (meal.food.carbs * meal.servings),
            fat: acc.fat + (meal.food.fat * meal.servings)
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      
      setDailySummary(summary);
      
      // Save meals to localStorage
      if (user) {
        localStorage.setItem(`meals-${user.id}`, JSON.stringify(meals));
      }
    } else {
      setDailySummary({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    }
  }, [meals, user]);

  const addMeal = (foodItem: FoodItem, mealType: MealEntry['mealType'], servings: number) => {
    if (!user) return;
    
    const newMeal: MealEntry = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: user.id,
      foodId: foodItem.id,
      food: foodItem,
      date: new Date().toISOString().split('T')[0],
      mealType,
      servings
    };
    
    setMeals([...meals, newMeal]);
  };

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const getRemainingNutrition = (): NutritionSummary => {
    return {
      calories: Math.max(0, dailyGoal.calories - dailySummary.calories),
      protein: Math.max(0, dailyGoal.protein - dailySummary.protein),
      carbs: Math.max(0, dailyGoal.carbs - dailySummary.carbs),
      fat: Math.max(0, dailyGoal.fat - dailySummary.fat)
    };
  };

  const value = {
    meals,
    addMeal,
    removeMeal,
    dailySummary,
    dailyGoal,
    getRemainingNutrition
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};
