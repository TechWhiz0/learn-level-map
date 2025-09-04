import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

const ClassDetail = () => {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();
  const { 
    getClassById, 
    getStudentsByClass, 
    getClassStatistics, 
    getProgressData, 
    getStudentProgressData 
  } = useStudents();
  const navigate = useNavigate();
  
  const [showYearData, setShowYearData] = useState(false);

  const classData = getClassById(classId!);
  const classStudents = getStudentsByClass(classId!);
  const classStats = getClassStatistics(classId!);
  const progressData = getProgressData(classId);
  const yearProgressData = getProgressData(classId, true);

  // Check if user has access to this class
  if (!classData || classData.teacherId !== user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have access to this class.</p>
          <Button onClick={() => navigate("/classes")}>Back to Classes</Button>
        </div>
      </div>
    );
  }

  const levelData = [
    {
      name: "Beginner",
      value: classStats.beginnerCount,
      color: "hsl(var(--level-beginner))",
    },
    {
      name: "Developing",
      value: classStats.developingCount,
      color: "hsl(var(--level-developing))",
    },
    {
      name: "Proficient",
      value: classStats.proficientCount,
      color: "hsl(var(--level-proficient))",
    },
  ];

  const getStudentGrade = (student: any) => {
    const averageScore = (student.readingScore + student.writingScore) / 2;
    if (averageScore >= 90) return { grade: "A", color: "text-green-600" };
    if (averageScore >= 80) return { grade: "B", color: "text-blue-600" };
    if (averageScore >= 70) return { grade: "C", color: "text-yellow-600" };
    if (averageScore >= 60) return { grade: "D", color: "text-orange-600" };
    return { grade: "F", color: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/classes")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
              <p className="text-gray-600">Grade {classData.grade} • {classData.subject}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/students?classId=${classId}`)}
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Manage Students
            </Button>
            <Button onClick={() => navigate("/assessment")}>
              <ClipboardList className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </div>
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
              <div className="text-2xl font-bold">{classStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">{classData.name}</p>
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
                {classStats.recentAssessments}
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
                {classStats.proficientCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {classStats.totalStudents > 0
                  ? Math.round(
                      (classStats.proficientCount / classStats.totalStudents) * 100
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
                {classStats.needSupportCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Require extra attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Class Stats */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance</CardTitle>
              <CardDescription>Average scores across the class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {classStats.averageReadingScore}
                  </div>
                  <p className="text-sm text-gray-600">Reading Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {classStats.averageWritingScore}
                  </div>
                  <p className="text-sm text-gray-600">Writing Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate(`/students?classId=${classId}`)}
                  className="w-full"
                  variant="outline"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
                <Button
                  onClick={() => navigate("/assessment")}
                  className="w-full"
                  variant="outline"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Conduct Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
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
              {classStats.totalStudents > 0 ? (
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
                      Beginner: {classStats.beginnerCount}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-level-developing-light text-level-developing"
                    >
                      Developing: {classStats.developingCount}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-level-proficient-light text-level-proficient"
                    >
                      Proficient: {classStats.proficientCount}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-2" />
                    <p>No students in this class yet</p>
                    <p className="text-sm">
                      Add students to see statistics
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
              {classStats.totalStudents > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={showYearData ? yearProgressData : progressData}>
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

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Students in {classData.name}</CardTitle>
            <CardDescription>
              {classStudents.length} student{classStudents.length !== 1 ? 's' : ''} enrolled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <p>No students enrolled yet</p>
                <p className="text-sm mb-4">
                  Add your first student to get started
                </p>
                <Button onClick={() => navigate(`/students?classId=${classId}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classStudents.map((student) => {
                  const grade = getStudentGrade(student);
                  const studentProgress = getStudentProgressData(student.id);
                  
                  return (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{student.name}</CardTitle>
                            <CardDescription className="text-sm">
                              Last assessed: {student.lastAssessment || "Never"}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`${grade.color} font-semibold`}
                          >
                            {grade.grade}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Current Level */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Level:</span>
                            <Badge
                              variant="secondary"
                              className={`${
                                student.currentLevel === "beginner"
                                  ? "bg-level-beginner-light text-level-beginner"
                                  : student.currentLevel === "developing"
                                  ? "bg-level-developing-light text-level-developing"
                                  : "bg-level-proficient-light text-level-proficient"
                              }`}
                            >
                              {student.currentLevel}
                            </Badge>
                          </div>

                          {/* Scores */}
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Reading:</span>
                              <span className="ml-2 font-medium">{student.readingScore}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Writing:</span>
                              <span className="ml-2 font-medium">{student.writingScore}</span>
                            </div>
                          </div>

                          {/* Progress Chart */}
                          {studentProgress.length > 0 && (
                            <div className="h-20">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={studentProgress}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" hide />
                                  <YAxis hide />
                                  <Line
                                    type="monotone"
                                    dataKey="readingScore"
                                    stroke="hsl(var(--level-beginner))"
                                    strokeWidth={2}
                                    dot={false}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="writingScore"
                                    stroke="hsl(var(--level-developing))"
                                    strokeWidth={2}
                                    dot={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                          {/* Action Button */}
                          <Button
                            onClick={() => navigate(`/assessment?studentId=${student.id}`)}
                            size="sm"
                            className="w-full"
                          >
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Assess Student
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassDetail;
