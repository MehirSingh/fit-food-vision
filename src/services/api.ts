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
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
    micronutrients: {
      calcium: '10mg',
      iron: '0.9mg',
      vitamin_a: '9μg',
      vitamin_c: '0mg',
      sodium: '74mg',
      potassium: '256mg'
    }
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    serving_size: '1 cup (195g)',
    image_url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6',
    micronutrients: {
      calcium: '20mg',
      iron: '0.8mg',
      vitamin_a: '0μg',
      vitamin_c: '0mg',
      sodium: '10mg',
      potassium: '154mg'
    }
  },
  {
    id: '3',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    serving_size: '100g',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    micronutrients: {
      calcium: '12mg',
      iron: '0.8mg',
      vitamin_a: '149μg',
      vitamin_c: '3.9mg',
      sodium: '50mg',
      potassium: '490mg'
    }
  },
  {
    id: '4',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    serving_size: '1/2 fruit',
    image_url: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad',
    micronutrients: {
      calcium: '12mg',
      iron: '0.6mg',
      vitamin_a: '7μg',
      vitamin_c: '10mg',
      sodium: '7mg',
      potassium: '485mg'
    }
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    calories: 100,
    protein: 18,
    carbs: 6,
    fat: 0,
    serving_size: '1 container (170g)',
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    micronutrients: {
      calcium: '200mg',
      iron: '0.1mg',
      vitamin_a: '150μg',
      vitamin_c: '0mg',
      sodium: '70mg',
      potassium: '240mg'
    }
  },
  {
    id: '6',
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    serving_size: '1 medium (118g)',
    image_url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919',
    micronutrients: {
      calcium: '5mg',
      iron: '0.3mg',
      vitamin_a: '3μg',
      vitamin_c: '10.3mg',
      sodium: '1mg',
      potassium: '422mg'
    }
  },
  {
    id: '7',
    name: 'Egg (Whole)',
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 5,
    serving_size: '1 large (50g)',
    image_url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03',
    micronutrients: {
      calcium: '28mg',
      iron: '0.9mg',
      vitamin_a: '160μg',
      vitamin_c: '0mg',
      sodium: '71mg',
      potassium: '69mg'
    }
  },
  {
    id: '8',
    name: 'Sweet Potato',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
    serving_size: '1 medium (130g)',
    image_url: 'https://images.unsplash.com/photo-1596097557993-54e1bbd4a1b5',
    micronutrients: {
      calcium: '38mg',
      iron: '0.7mg',
      vitamin_a: '1403μg',
      vitamin_c: '22.3mg',
      sodium: '72mg',
      potassium: '448mg'
    }
  },
  {
    id: '9',
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 21.3,
    fat: 1.9,
    serving_size: '1/2 cup cooked (92g)',
    image_url: 'https://images.unsplash.com/photo-1615419235091-97d024afc8e0',
    micronutrients: {
      calcium: '17mg',
      iron: '1.5mg',
      vitamin_a: '5μg',
      vitamin_c: '0mg',
      sodium: '7mg',
      potassium: '172mg'
    }
  },
  {
    id: '10',
    name: 'Almonds',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    serving_size: '1 ounce (28g)',
    image_url: 'https://images.unsplash.com/photo-1563406580073-cb1c7736c253',
    micronutrients: {
      calcium: '76mg',
      iron: '1.1mg',
      vitamin_a: '0μg',
      vitamin_c: '0mg',
      sodium: '0mg',
      potassium: '208mg'
    }
  },
  {
    id: '11',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    serving_size: '100g',
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
    micronutrients: {
      calcium: '99mg',
      iron: '2.7mg',
      vitamin_a: '469μg',
      vitamin_c: '28mg',
      sodium: '79mg',
      potassium: '558mg'
    }
  },
  {
    id: '12',
    name: 'Oatmeal',
    calories: 158,
    protein: 6,
    carbs: 27,
    fat: 3,
    serving_size: '1 cup cooked (234g)',
    image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
    micronutrients: {
      calcium: '21mg',
      iron: '1.7mg',
      vitamin_a: '0μg',
      vitamin_c: '0mg',
      sodium: '2mg',
      potassium: '164mg'
    }
  }
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
  }
];
