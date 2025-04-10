
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
import { Search, Camera, X, Plus, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';

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

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Food Tracker</h1>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Search by Text</TabsTrigger>
            <TabsTrigger value="image">Upload Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Food</CardTitle>
                <CardDescription>
                  Enter a food name to search for nutrition information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search foods (e.g. chicken breast, apple)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={searching}>
                    {searching ? "Searching..." : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <Card>
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
                        className="max-h-64 rounded-md mx-auto"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={handleClearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Label 
                        htmlFor="picture" 
                        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 space-y-2 hover:border-primary/50 transition-all"
                      >
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload image</span>
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
                    <Button onClick={handleImageSearch} disabled={searching}>
                      {searching ? "Identifying..." : "Identify Food"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {searchResults.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {searchResults.map((food) => (
                <div 
                  key={food.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors flex justify-between items-center ${selectedFood?.id === food.id ? 'border-primary bg-muted/50' : ''}`}
                  onClick={() => handleSelectFood(food)}
                >
                  <div className="flex items-center space-x-3">
                    {food.image_url ? (
                      <img 
                        src={food.image_url} 
                        alt={food.name} 
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{food.name}</h3>
                      <p className="text-sm text-muted-foreground">{food.serving_size}, {food.calories} calories</p>
                    </div>
                  </div>
                  
                  {selectedFood?.id === food.id ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {selectedFood && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Add to Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedFood.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedFood.calories} calories per {selectedFood.serving_size}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-type">Meal Type</Label>
                    <Select value={mealType} onValueChange={(value) => setMealType(value as any)}>
                      <SelectTrigger id="meal-type">
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
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Total Calories</Label>
                    <div className="h-10 px-3 py-2 border rounded-md bg-muted/50 flex items-center">
                      {Math.round(selectedFood.calories * parseFloat(servings || '0'))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="font-medium">{Math.round(selectedFood.protein * parseFloat(servings || '0'))}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="font-medium">{Math.round(selectedFood.carbs * parseFloat(servings || '0'))}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="font-medium">{Math.round(selectedFood.fat * parseFloat(servings || '0'))}g</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddFood} className="w-full">
                Add to Food Diary
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </>
  );
};

export default FoodTracker;
