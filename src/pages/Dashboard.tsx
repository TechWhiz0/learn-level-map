import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, TrendingUp, Plus, UserPlus, ClipboardList, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for the first version
const mockClassData = {
  totalStudents: 32,
  beginnerCount: 8,
  developingCount: 15,
  proficientCount: 9,
  recentAssessments: 28
};

const levelData = [
  { name: 'Beginner', value: mockClassData.beginnerCount, color: 'hsl(var(--level-beginner))' },
  { name: 'Developing', value: mockClassData.developingCount, color: 'hsl(var(--level-developing))' },
  { name: 'Proficient', value: mockClassData.proficientCount, color: 'hsl(var(--level-proficient))' }
];

const progressData = [
  { month: 'Sep', beginner: 12, developing: 12, proficient: 8 },
  { month: 'Oct', beginner: 10, developing: 14, proficient: 8 },
  { month: 'Nov', beginner: 8, developing: 15, proficient: 9 }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">SkillMap</h1>
            <div className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">Welcome back, </span>
              <span className="font-medium">{user?.name}</span>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockClassData.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Grade 5A</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Assessments</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockClassData.recentAssessments}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proficient Students</CardTitle>
              <TrendingUp className="h-4 w-4 text-level-proficient" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-proficient">{mockClassData.proficientCount}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((mockClassData.proficientCount / mockClassData.totalStudents) * 100)}% of class
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Support</CardTitle>
              <BookOpen className="h-4 w-4 text-level-beginner" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-beginner">{mockClassData.beginnerCount}</div>
              <p className="text-xs text-muted-foreground">Require extra attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Button 
            onClick={() => navigate('/students')} 
            className="h-auto flex flex-col space-y-2 p-4"
            variant="outline"
          >
            <UserPlus className="h-6 w-6" />
            <span>Manage Students</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/assessment')} 
            className="h-auto flex flex-col space-y-2 p-4"
            variant="outline"
          >
            <ClipboardList className="h-6 w-6" />
            <span>New Assessment</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/groups')} 
            className="h-auto flex flex-col space-y-2 p-4"
            variant="outline"
          >
            <Users className="h-6 w-6" />
            <span>View Groups</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/analytics')} 
            className="h-auto flex flex-col space-y-2 p-4"
            variant="outline"
          >
            <BarChart3 className="h-6 w-6" />
            <span>Analytics</span>
          </Button>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Current Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Current Skill Levels</CardTitle>
              <CardDescription>Distribution of students by learning level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={levelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {levelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="bg-level-beginner-light text-level-beginner">
                  Beginner: {mockClassData.beginnerCount}
                </Badge>
                <Badge variant="secondary" className="bg-level-developing-light text-level-developing">
                  Developing: {mockClassData.developingCount}
                </Badge>
                <Badge variant="secondary" className="bg-level-proficient-light text-level-proficient">
                  Proficient: {mockClassData.proficientCount}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
              <CardDescription>Monthly changes in skill level distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="beginner" stackId="a" fill="hsl(var(--level-beginner))" />
                    <Bar dataKey="developing" stackId="a" fill="hsl(var(--level-developing))" />
                    <Bar dataKey="proficient" stackId="a" fill="hsl(var(--level-proficient))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest assessments and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-level-proficient rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Priya Singh improved to Proficient level</p>
                  <p className="text-xs text-muted-foreground">Reading assessment - 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-level-developing rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">5 students completed writing assessment</p>
                  <p className="text-xs text-muted-foreground">Batch assessment - 1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New student Rahul Kumar added to class</p>
                  <p className="text-xs text-muted-foreground">Student management - 2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;