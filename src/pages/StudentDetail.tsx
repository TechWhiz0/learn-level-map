import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, PenTool, TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock student data - in real app, fetch by ID
  const student = {
    id: id,
    name: "Anjali Sharma",
    rollNumber: "15",
    currentLevel: "developing",
    joinDate: "2024-01-15",
    assessments: [
      { date: "2024-01-15", reading: 6, writing: 5, overall: "developing" },
      { date: "2024-02-15", reading: 7, writing: 6, overall: "developing" },
      { date: "2024-03-15", reading: 8, writing: 7, overall: "proficient" },
      { date: "2024-04-15", reading: 8, writing: 8, overall: "proficient" },
    ]
  };

  const levelColors = {
    beginner: "destructive" as const,
    developing: "secondary" as const, 
    proficient: "default" as const
  };

  const levelLabels = {
    beginner: "Beginner",
    developing: "Developing",
    proficient: "Proficient"
  };

  const progressData = student.assessments.map((assessment, index) => ({
    month: `Month ${index + 1}`,
    reading: assessment.reading,
    writing: assessment.writing,
    combined: Math.round((assessment.reading + assessment.writing) / 2)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/students")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
        </div>

        {/* Student Overview */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-foreground">{student.name}</CardTitle>
                <p className="text-muted-foreground">Roll Number: {student.rollNumber}</p>
                <p className="text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Joined: {new Date(student.joinDate).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={levelColors[student.currentLevel as keyof typeof levelColors]}>
                {levelLabels[student.currentLevel as keyof typeof levelLabels]}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer"
                onClick={() => navigate("/assessment")}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-primary/10 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">New Assessment</h3>
                <p className="text-sm text-muted-foreground">Conduct reading & writing assessment</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-accent/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Progress Report</h3>
                <p className="text-sm text-muted-foreground">Generate detailed progress report</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="reading" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Reading"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="writing" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Writing"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="combined" 
                    stroke="hsl(var(--secondary-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Combined"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Assessment History */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.assessments.map((assessment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">{new Date(assessment.date).toLocaleDateString()}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>Reading: {assessment.reading}/10</span>
                      <span>Writing: {assessment.writing}/10</span>
                    </div>
                  </div>
                  <Badge variant={levelColors[assessment.overall as keyof typeof levelColors]}>
                    {levelLabels[assessment.overall as keyof typeof levelLabels]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetail;