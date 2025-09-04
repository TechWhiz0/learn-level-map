import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Users, TrendingUp } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from navigation state
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Required fields missing",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    try {
      await login(email, password);
      toast({
        title: "Welcome to SkillMap!",
        description: "Successfully logged in",
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      let errorMessage = "Login failed. Please check your credentials.";
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Skill<span className="text-primary">Map</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Empower every student with personalized learning assessment and progress tracking
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 p-4 rounded-lg bg-level-proficient-light">
              <BookOpen className="h-8 w-8 text-level-proficient" />
              <div>
                <h3 className="font-semibold text-sm">Easy Assessment</h3>
                <p className="text-xs text-muted-foreground">Quick reading & writing evaluations</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-3 p-4 rounded-lg bg-level-developing-light">
              <Users className="h-8 w-8 text-level-developing" />
              <div>
                <h3 className="font-semibold text-sm">Smart Grouping</h3>
                <p className="text-xs text-muted-foreground">Automatic skill-based grouping</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-3 p-4 rounded-lg bg-primary-light">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-sm">Track Progress</h3>
                <p className="text-xs text-muted-foreground">Visual progress monitoring</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-medium">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your SkillMap teacher account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;