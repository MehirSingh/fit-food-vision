
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useFood } from '@/context/FoodContext';
import Header from '@/components/Header';
import { Plus, UtensilsCrossed } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { dailySummary, dailyGoal, meals } = useFood();

  const caloriePercentage = Math.min(Math.round((dailySummary.calories / dailyGoal.calories) * 100), 100);

  const macroData = [
    { name: 'Protein', value: dailySummary.protein, goal: dailyGoal.protein, color: '#3182CE' },
    { name: 'Carbs', value: dailySummary.carbs, goal: dailyGoal.carbs, color: '#ED8936' },
    { name: 'Fat', value: dailySummary.fat, goal: dailyGoal.fat, color: '#38A169' },
  ];

  const pieData = [
    { name: 'Protein', value: dailySummary.protein * 4 }, // 4 calories per gram
    { name: 'Carbs', value: dailySummary.carbs * 4 }, // 4 calories per gram
    { name: 'Fat', value: dailySummary.fat * 9 }, // 9 calories per gram
  ];

  const COLORS = ['#3182CE', '#ED8936', '#38A169'];

  // Group meals by type
  const mealsByType = meals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) {
      acc[meal.mealType] = [];
    }
    acc[meal.mealType].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>);

  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  return (
    <>
      <Header />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          {/* Welcome section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
              <p className="text-muted-foreground">
                Your daily nutrition dashboard for {new Date().toLocaleDateString()}
              </p>
            </div>
            <Button className="mt-4 sm:mt-0" asChild>
              <Link to="/food-tracker">
                <Plus className="mr-2 h-4 w-4" />
                Log Food
              </Link>
            </Button>
          </div>

          {/* Calorie summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dailySummary.calories} / {dailyGoal.calories}</div>
                <p className="text-xs text-muted-foreground">calories consumed</p>
                <Progress value={caloriePercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {caloriePercentage}% of daily goal
                </p>
              </CardContent>
            </Card>
            {/* Macro cards */}
            {macroData.map((macro) => (
              <Card key={macro.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{macro.name}</CardTitle>
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: macro.color }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{macro.value}g / {macro.goal}g</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((macro.value / macro.goal) * 100)}% of daily goal
                  </p>
                  <Progress 
                    value={Math.min(Math.round((macro.value / macro.goal) * 100), 100)} 
                    className="mt-2" 
                    indicatorClassName={`bg-[${macro.color}]`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Macronutrient breakdown chart */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Macronutrient Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Today's meals summary */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mealTypeOrder.map((mealType) => (
                    <div key={mealType} className="space-y-2">
                      <h4 className="font-medium capitalize">{mealType}</h4>
                      {mealsByType[mealType] && mealsByType[mealType].length > 0 ? (
                        <ul className="space-y-2">
                          {mealsByType[mealType].map((meal) => (
                            <li key={meal.id} className="text-sm flex justify-between items-center">
                              <span>{meal.food.name} ({meal.servings} serving{meal.servings > 1 ? 's' : ''})</span>
                              <span className="text-muted-foreground">{meal.food.calories * meal.servings} cal</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-muted-foreground flex items-center">
                          <UtensilsCrossed className="h-4 w-4 mr-2" />
                          <span>No meals logged</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
