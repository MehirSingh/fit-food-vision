
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight } from 'lucide-react';

const tips = [
  "Eat protein with every meal to help build and maintain muscle.",
  "Stay hydrated! Aim to drink at least 8 glasses of water daily.",
  "Consuming healthy fats like avocados and nuts can help reduce inflammation.",
  "Eat a rainbow of fruits and vegetables to get a wide variety of nutrients.",
  "Limit processed foods and added sugars to improve overall health.",
  "Include fiber-rich foods in your diet to aid digestion.",
  "Post-workout nutrition is crucial - aim to consume protein within 30 minutes.",
  "Meal prepping can help you make healthier food choices throughout the week.",
  "Omega-3 fatty acids found in fish can benefit heart and brain health.",
  "Using smaller plates can help with portion control and prevent overeating.",
  "Calcium and vitamin D work together to build strong bones.",
  "Iron is essential for oxygen transport in the blood - leafy greens are a good source.",
  "Probiotics in yogurt and fermented foods support gut health.",
  "Antioxidants in berries can help fight inflammation.",
  "Adequate protein intake is essential for muscle recovery after workouts."
];

const NutritionTip = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
        setIsAnimating(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleNextTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <Card className="mb-6 border-l-4 border-l-amber-500 overflow-hidden">
      <CardContent className="p-4 flex items-center">
        <Lightbulb className="text-amber-500 mr-3 h-6 w-6 shrink-0" />
        <div className="flex-1">
          <div
            className={`transition-all duration-500 ease-in-out ${
              isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <p className="text-sm">{tips[currentTip]}</p>
          </div>
        </div>
        <button
          onClick={handleNextTip}
          className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Next tip"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
};

export default NutritionTip;
