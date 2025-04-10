
import { FoodItem, MealRecommendation } from '../types';

// In a real app, we would use environment variables for API keys
const NUTRITIONIX_APP_ID = 'your_app_id';
const NUTRITIONIX_API_KEY = 'your_api_key';

export const searchFoodByText = async (query: string): Promise<FoodItem[]> => {
  // This is a mock function for now
  // In a real app, we would call the Nutritionix API
  console.log(`Searching for: ${query}`);
  
  // Mock response
  return mockFoodData.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const getFoodByImage = async (imageFile: File): Promise<FoodItem[]> => {
  // In a real app, we would upload the image and use ML to identify food
  console.log('Image uploaded:', imageFile.name);
  
  // Mock response - return random food items
  return mockFoodData.slice(0, 3);
};

export const getMealRecommendations = async (
  goal: string, 
  remainingCalories: number,
  remainingProtein: number,
  remainingCarbs: number,
  remainingFat: number
): Promise<MealRecommendation[]> => {
  // In a real app, this would be a more complex algorithm based on user goals
  console.log(`Getting meal recommendations for ${goal} with ${remainingCalories} calories remaining`);
  
  // Simple mock implementation - filter meals based on calories
  return mockRecommendations.filter(meal => 
    meal.calories <= remainingCalories * 1.1 && 
    meal.calories >= remainingCalories * 0.5
  ).slice(0, 3);
};

// Mock data for initial development
const mockFoodData: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving_size: '100g',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791'
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    serving_size: '1 cup (195g)',
    image_url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6'
  },
  {
    id: '3',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    serving_size: '100g',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'
  },
  {
    id: '4',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    serving_size: '1/2 fruit',
    image_url: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    calories: 100,
    protein: 18,
    carbs: 6,
    fat: 0,
    serving_size: '1 container (170g)',
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777'
  },
  {
    id: '6',
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    serving_size: '1 medium (118g)',
    image_url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919'
  },
];

const mockRecommendations: MealRecommendation[] = [
  {
    id: '1',
    name: 'Chicken & Rice Bowl',
    calories: 450,
    protein: 35,
    carbs: 50,
    fat: 10,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    recipe: 'Grilled chicken breast, brown rice, broccoli, and a tablespoon of olive oil'
  },
  {
    id: '2',
    name: 'Protein Smoothie',
    calories: 300,
    protein: 30,
    carbs: 30,
    fat: 5,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a90bb0b1',
    recipe: 'Blend 1 scoop protein powder, 1 banana, 1 cup milk, and ice'
  },
  {
    id: '3',
    name: 'Salmon Salad',
    calories: 380,
    protein: 28,
    carbs: 15,
    fat: 22,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0',
    recipe: 'Grilled salmon on a bed of mixed greens with olive oil dressing'
  },
  {
    id: '4',
    name: 'Vegetarian Stir Fry',
    calories: 320,
    protein: 15,
    carbs: 45,
    fat: 12,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    recipe: 'Tofu, mixed vegetables, and brown rice with soy sauce'
  },
  {
    id: '5',
    name: 'Oatmeal with Fruit',
    calories: 290,
    protein: 10,
    carbs: 50,
    fat: 5,
    imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc',
    recipe: '1 cup oats cooked with milk, topped with berries and honey'
  },
];
