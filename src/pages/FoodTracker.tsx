
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useFood } from '@/context/FoodContext';
import { searchFoodByText, getFoodByImage } from '@/services/api';
import { FoodItem } from '@/types';
import { Search, Camera, X, Plus, Check, UtensilsCrossed, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';
import NutritionTip from '@/components/NutritionTip';

const FoodTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [servings, setServings] = useState('1');
  const [searching, setSearching] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { addMeal } = useFood();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a food item to search",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      const results = await searchFoodByText(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        toast({
          title: "No results",
          description: "No food items found for your search",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for food items",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    setSearchResults([]);
    setSelectedFood(null);
  };

  const handleImageSearch = async () => {
    if (!uploadedImage) return;

    setSearching(true);
    try {
      const results = await getFoodByImage(uploadedImage);
      setSearchResults(results);
      if (results.length === 0) {
        toast({
          title: "No results",
          description: "No food items identified from the image",
        });
      } else {
        toast({
          title: "Food Identified",
          description: `We found ${results.length} potential food items`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to identify food from image",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleAddFood = () => {
    if (!selectedFood) {
      toast({
        title: "Error",
        description: "Please select a food item",
        variant: "destructive",
      });
      return;
    }

    addMeal(selectedFood, mealType, parseFloat(servings));
    toast({
      title: "Success",
      description: `${selectedFood.name} added to your ${mealType}`,
    });

    // Reset the form
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFood(null);
    setServings('1');
  };

  // Color coding for different food types
  const getFoodTypeColor = (food: FoodItem) => {
    if (food.protein > 15) return 'bg-blue-100 border-blue-300';
    if (food.carbs > 30) return 'bg-orange-100 border-orange-300';
    if (food.fat > 10) return 'bg-purple-100 border-purple-300';
    return 'bg-green-100 border-green-300';
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Food Tracker</h1>
        
        <NutritionTip />

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Search className="h-4 w-4 mr-2" />
              Search by Text
            </TabsTrigger>
            <TabsTrigger value="image" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Camera className="h-4 w-4 mr-2" />
              Upload Image
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle>Search Food</CardTitle>
                <CardDescription>
                  Enter a food name to search for nutrition information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search foods (e.g. chicken breast, egg whole, apple)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                  />
                  <Button onClick={handleSearch} disabled={searching} className="transition-transform hover:scale-105">
                    {searching ? "Searching..." : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <Card className="border-t-4 border-t-teal-500">
              <CardHeader>
                <CardTitle>Upload Food Image</CardTitle>
                <CardDescription>
                  Take a picture of your food to identify it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Food preview" 
                        className="max-h-64 rounded-md mx-auto object-cover shadow-md"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-75 hover:opacity-100 transition-opacity"
                        onClick={handleClearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Label 
                        htmlFor="picture" 
                        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 space-y-2 hover:border-primary/50 transition-all hover:bg-primary/5"
                      >
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload image</span>
                        <span className="text-xs text-muted-foreground/70">JPG, PNG, GIF up to 10MB</span>
                        <Input 
                          id="picture" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </Label>
                    </div>
                  )}

                  {uploadedImage && (
                    <Button 
                      onClick={handleImageSearch} 
                      disabled={searching} 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
                    >
                      {searching ? "Identifying..." : "Identify Food"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mt-6 border-t-4 border-t-amber-500">
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.map((food) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                        getFoodTypeColor(food)
                      } ${selectedFood?.id === food.id ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''}`}
                      onClick={() => handleSelectFood(food)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {food.image_url ? (
                            <img 
                              src={food.image_url} 
                              alt={food.name} 
                              className="h-16 w-16 object-cover rounded-md shadow-sm"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                              <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium">{food.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                {food.protein}g protein
                              </Badge>
                              <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                                {food.carbs}g carbs
                              </Badge>
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                {food.fat}g fat
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{food.serving_size}, {food.calories} calories</p>
                          </div>
                        </div>
                        
                        {selectedFood?.id === food.id ? (
                          <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <Plus className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedFood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mt-6 border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle>Add to Meal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">{selectedFood.name}</h3>
                    {selectedFood.micronutrients && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Micronutrients</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedFood.micronutrients.calcium && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                                  <span className="text-sm">Calcium: {selectedFood.micronutrients.calcium}</span>
                                </div>
                              )}
                              {selectedFood.micronutrients.iron && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-red-400" />
                                  <span className="text-sm">Iron: {selectedFood.micronutrients.iron}</span>
                                </div>
                              )}
                              {selectedFood.micronutrients.vitamin_a && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                                  <span className="text-sm">Vitamin A: {selectedFood.micronutrients.vitamin_a}</span>
                                </div>
                              )}
                              {selectedFood.micronutrients.vitamin_c && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                  <span className="text-sm">Vitamin C: {selectedFood.micronutrients.vitamin_c}</span>
                                </div>
                              )}
                              {selectedFood.micronutrients.sodium && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-pink-400" />
                                  <span className="text-sm">Sodium: {selectedFood.micronutrients.sodium}</span>
                                </div>
                              )}
                              {selectedFood.micronutrients.potassium && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-green-400" />
                                  <span className="text-sm">Potassium: {selectedFood.micronutrients.potassium}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {selectedFood.calories} calories per {selectedFood.serving_size}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meal-type">Meal Type</Label>
                      <Select value={mealType} onValueChange={(value) => setMealType(value as any)}>
                        <SelectTrigger id="meal-type" className="transition-all hover:border-primary">
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="servings">Number of Servings</Label>
                      <Input
                        id="servings"
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Total Calories</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-muted/50 flex items-center font-medium">
                        {Math.round(selectedFood.calories * parseFloat(servings || '0'))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">Protein</p>
                      <p className="text-lg font-bold text-blue-700">{Math.round(selectedFood.protein * parseFloat(servings || '0'))}g</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
                      <p className="text-sm font-medium text-orange-800">Carbs</p>
                      <p className="text-lg font-bold text-orange-700">{Math.round(selectedFood.carbs * parseFloat(servings || '0'))}g</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                      <p className="text-sm font-medium text-purple-800">Fat</p>
                      <p className="text-lg font-bold text-purple-700">{Math.round(selectedFood.fat * parseFloat(servings || '0'))}g</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAddFood} 
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Food Diary
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </main>
    </>
  );
};

export default FoodTracker;
