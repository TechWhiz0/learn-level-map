import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, TrendingUp, BarChart3 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
            Skill<span className="text-primary">Map</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empower every student with personalized learning assessment and progress tracking designed for Indian government schools
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <Card className="text-center p-6 shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-level-proficient-light rounded-lg flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-level-proficient" />
              </div>
              <h3 className="text-lg font-semibold">Easy Assessment</h3>
              <p className="text-muted-foreground text-sm">
                Quick and intuitive reading & writing evaluations designed for classroom use
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-level-developing-light rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-level-developing" />
              </div>
              <h3 className="text-lg font-semibold">Smart Grouping</h3>
              <p className="text-muted-foreground text-sm">
                Automatic skill-based student grouping for differentiated instruction
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Track Progress</h3>
              <p className="text-muted-foreground text-sm">
                Visual progress monitoring and improvement tracking over time
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Data Insights</h3>
              <p className="text-muted-foreground text-sm">
                Actionable insights and reports for better educational outcomes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Levels Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Understanding Learning Levels</h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <Card className="border-2 border-level-beginner">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-level-beginner rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-level-beginner mb-2">Beginner</h3>
                <p className="text-sm text-muted-foreground">
                  Students need foundational support and basic skill development
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-level-developing">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-level-developing rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-level-developing mb-2">Developing</h3>
                <p className="text-sm text-muted-foreground">
                  Students are progressing and building confidence in their abilities
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-level-proficient">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-level-proficient rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-level-proficient mb-2">Proficient</h3>
                <p className="text-sm text-muted-foreground">
                  Students demonstrate strong skills and are ready for advanced challenges
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Classroom?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teachers using SkillMap to provide personalized education and track student growth
          </p>
          <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-12">
            Start Free Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
