
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, FitnessGoal } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, goal: FitnessGoal) => Promise<void>;
  logout: () => void;
  updateUserGoal: (goal: FitnessGoal) => void;
  updateUserProfile: (profile: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock login - In a real app, this would be an API call
      console.log('Logging in with:', email, password);
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        goal: 'muscle_gain',
        tdee: 2500,
        age: 30,
        weight: 80,
        height: 180,
        activityLevel: 'moderate'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, goal: FitnessGoal) => {
    try {
      // Mock signup - In a real app, this would be an API call
      console.log('Signing up:', name, email, password, goal);
      
      // Mock successful signup
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        goal,
        tdee: 2000, // Default value
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserGoal = (goal: FitnessGoal) => {
    if (user) {
      const updatedUser = { ...user, goal };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserGoal,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
