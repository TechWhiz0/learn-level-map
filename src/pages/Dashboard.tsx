import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudents } from "@/contexts/StudentsContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  BookOpen,
  TrendingUp,
  Plus,
  UserPlus,
  ClipboardList,
  BarChart3,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { getStatistics, getProgressData, classes } = useStudents();
  const navigate = useNavigate();
  const [showYearData, setShowYearData] = useState(false);

  // Filter classes for current teacher
  const teacherClasses = classes.filter((cls) => cls.teacherId === user?.id);

  // Get combined statistics for all teacher's classes
  const stats = getStatistics();
  const progressData = getProgressData();
  const yearProgressData = getProgressData(undefined, true);

  const levelData = [
    {
      name: "Beginner",
      value: stats.beginnerCount,
      color: "hsl(var(--level-beginner))",
    },
    {
      name: "Developing",
      value: stats.developingCount,
      color: "hsl(var(--level-developing))",
    },
    {
      name: "Proficient",
      value: stats.proficientCount,
      color: "hsl(var(--level-proficient))",
    },
  ];

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
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await logout();
              } catch (error) {
                console.error("Logout error:", error);
              }
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                {teacherClasses.length} class
                {teacherClasses.length !== 1 ? "es" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Assessments
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.recentAssessments}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Proficient Students
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-level-proficient" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-proficient">
                {stats.proficientCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalStudents > 0
                  ? Math.round(
                      (stats.proficientCount / stats.totalStudents) * 100
                    )
                  : 0}
                % of class
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Need Support
              </CardTitle>
              <BookOpen className="h-4 w-4 text-level-beginner" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-beginner">
                {stats.needSupportCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Require extra attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-8">
          <Button
            onClick={() => navigate("/classes")}
            className="h-auto flex flex-col space-y-2 p-4"
            variant="outline"
          >
            <GraduationCap className="h-6 w-6" />
            <span>Manage Classes</span>
          </Button>

          <Button
            onClick={() => navigate("/assessment")}
            className="h-auto flex flex-col space-y-2 p-4"
            variant="outline"
          >
            <ClipboardList className="h-6 w-6" />
            <span>New Assessment</span>
          </Button>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Current Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Current Skill Levels</CardTitle>
              <CardDescription>
                Distribution of students by learning level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.totalStudents > 0 ? (
                <>
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
                    <Badge
                      variant="secondary"
                      className="bg-level-beginner-light text-level-beginner"
                    >
                      Beginner: {stats.beginnerCount}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-level-developing-light text-level-developing"
                    >
                      Developing: {stats.developingCount}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-level-proficient-light text-level-proficient"
                    >
                      Proficient: {stats.proficientCount}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-2" />
                    <p>No students added yet</p>
                    <p className="text-sm">
                      Add your first student to see statistics
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Trends */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Progress Over Time</CardTitle>
                  <CardDescription>
                    {showYearData
                      ? "Entire year skill level distribution"
                      : "Monthly changes in skill level distribution"}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowYearData(!showYearData)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  {showYearData ? "View Current" : "View Year"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stats.totalStudents > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={showYearData ? yearProgressData : progressData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Bar
                        dataKey="beginner"
                        stackId="a"
                        fill="hsl(var(--level-beginner))"
                      />
                      <Bar
                        dataKey="developing"
                        stackId="a"
                        fill="hsl(var(--level-developing))"
                      />
                      <Bar
                        dataKey="proficient"
                        stackId="a"
                        fill="hsl(var(--level-proficient))"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>No data to display</p>
                    <p className="text-sm">
                      Progress charts will appear when you have students
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Year Data Popup */}
        <Dialog open={showYearData} onOpenChange={setShowYearData}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Entire Year Progress Data
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {yearProgressData.length > 0 ? (
                <>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Bar
                          dataKey="beginner"
                          stackId="a"
                          fill="hsl(var(--level-beginner))"
                        />
                        <Bar
                          dataKey="developing"
                          stackId="a"
                          fill="hsl(var(--level-developing))"
                        />
                        <Bar
                          dataKey="proficient"
                          stackId="a"
                          fill="hsl(var(--level-proficient))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-12 gap-2 text-xs">
                    {yearProgressData.map((month, index) => (
                      <div
                        key={index}
                        className="text-center p-2 border rounded"
                      >
                        <div className="font-semibold">{month.month}</div>
                        <div className="text-level-beginner">
                          B: {month.beginner}
                        </div>
                        <div className="text-level-developing">
                          D: {month.developing}
                        </div>
                        <div className="text-level-proficient">
                          P: {month.proficient}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2" />
                  <p>No year data available</p>
                  <p className="text-sm">
                    Conduct assessments to see yearly progress
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest assessments and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.totalStudents > 0 ? (
              <div className="space-y-4">
                {stats.recentAssessments > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-level-proficient rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {stats.recentAssessments} assessments completed this
                        month
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Current month progress
                      </p>
                    </div>
                  </div>
                )}

                {stats.needSupportCount > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-level-beginner rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {stats.needSupportCount} students need extra support
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Focus on beginner level and low-scoring students
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {stats.totalStudents} total students in your class
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Active class roster
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <p>No recent activity</p>
                <p className="text-sm">
                  Start by adding students to your class
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
