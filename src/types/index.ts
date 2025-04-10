
export interface User {
  id: string;
  name: string;
  email: string;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  tdee?: number;
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface Micronutrients {
  calcium?: string;
  iron?: string;
  vitamin_a?: string;
  vitamin_c?: string;
  sodium?: string;
  potassium?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  image_url?: string;
  micronutrients?: Micronutrients;
}

export interface MealEntry {
  id: string;
  userId: string;
  foodId: string;
  food: FoodItem;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealRecommendation {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  recipe?: string;
}

export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'maintenance';

export interface DailyStats {
  date: string;
  caloriesConsumed: number;
  caloriesGoal: number;
  proteinConsumed: number;
  proteinGoal: number;
  carbsConsumed: number;
  carbsGoal: number;
  fatConsumed: number;
  fatGoal: number;
}

