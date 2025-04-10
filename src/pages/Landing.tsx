
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Camera, AreaChart, Utensils, Activity } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b w-full bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">FitFoodVision</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Track Your Nutrition with <span className="text-primary">AI-Powered</span> Food Recognition
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Simply upload a photo of your meal or search for foods to get instant nutritional information tailored to your fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to={user ? "/dashboard" : "/signup"}>
                {user ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Food Image Recognition</h3>
              <p className="text-muted-foreground">
                Take a photo of your meal and our AI will identify the food and provide nutrition information.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <AreaChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Nutrition Tracking</h3>
              <p className="text-muted-foreground">
                Track your daily calories, macronutrients, and progress with detailed charts and analytics.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Recommendations</h3>
              <p className="text-muted-foreground">
                Get meal suggestions based on your specific fitness goals and remaining daily nutrients.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Goal Setting</h3>
              <p className="text-muted-foreground">
                Set and track progress toward weight loss, muscle gain, or maintenance goals with smart metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and set your fitness goals, activity level, and physical details to get personalized recommendations.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Track Your Food</h3>
              <p className="text-muted-foreground">
                Snap photos of your meals or search our database to log your food intake with accurate nutritional data.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Get Insights</h3>
              <p className="text-muted-foreground">
                View your progress, nutrition breakdown, and receive meal recommendations tailored to your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Nutrition?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join FitFoodVision today and start your journey toward better health and fitness.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to={user ? "/dashboard" : "/signup"}>
              {user ? "Go to Dashboard" : "Get Started Free"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted text-center">
        <div className="container mx-auto">
          <p className="text-xl font-bold text-primary mb-4">FitFoodVision</p>
          <p className="text-muted-foreground mb-8">
            Nutrition tracking and meal recommendations powered by AI
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground">
              Sign Up
            </Link>
            <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
