import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, PenTool, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Assessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [readingScore, setReadingScore] = useState("");
  const [writingScore, setWritingScore] = useState("");
  const [notes, setNotes] = useState("");

  // Mock students data
  const students = [
    { id: "1", name: "Anjali Sharma", rollNumber: "15" },
    { id: "2", name: "Rahul Kumar", rollNumber: "08" },
    { id: "3", name: "Priya Singh", rollNumber: "22" },
    { id: "4", name: "Amit Patel", rollNumber: "11" },
    { id: "5", name: "Deepika Rao", rollNumber: "19" }
  ];

  const calculateLevel = (reading: number, writing: number) => {
    const average = (reading + writing) / 2;
    if (average >= 7) return "proficient";
    if (average >= 4) return "developing";
    return "beginner";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "proficient": return "success";
      case "developing": return "warning";
      case "beginner": return "destructive";
      default: return "secondary";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !readingScore || !writingScore) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const reading = parseInt(readingScore);
    const writing = parseInt(writingScore);
    const level = calculateLevel(reading, writing);
    
    // Mock save - in real app, save to database
    toast({
      title: "Assessment Saved",
      description: `Assessment for ${students.find(s => s.id === selectedStudent)?.name} has been saved successfully.`,
    });

    // Reset form
    setSelectedStudent("");
    setReadingScore("");
    setWritingScore("");
    setNotes("");
  };

  const currentLevel = readingScore && writingScore ? 
    calculateLevel(parseInt(readingScore), parseInt(writingScore)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Assessment Form */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6" />
              Student Assessment
            </CardTitle>
            <p className="text-muted-foreground">
              Conduct reading and writing assessment for your students
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Selection */}
              <div className="space-y-2">
                <Label htmlFor="student" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Select Student
                </Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} (Roll No: {student.rollNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reading Assessment */}
              <div className="space-y-2">
                <Label htmlFor="reading" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Reading Score (1-10)
                </Label>
                <Input
                  id="reading"
                  type="number"
                  min="1"
                  max="10"
                  value={readingScore}
                  onChange={(e) => setReadingScore(e.target.value)}
                  placeholder="Enter reading score"
                />
                <p className="text-xs text-muted-foreground">
                  1-3: Beginner | 4-6: Developing | 7-10: Proficient
                </p>
              </div>

              {/* Writing Assessment */}
              <div className="space-y-2">
                <Label htmlFor="writing" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Writing Score (1-10)
                </Label>
                <Input
                  id="writing"
                  type="number"
                  min="1"
                  max="10"
                  value={writingScore}
                  onChange={(e) => setWritingScore(e.target.value)}
                  placeholder="Enter writing score"
                />
                <p className="text-xs text-muted-foreground">
                  1-3: Beginner | 4-6: Developing | 7-10: Proficient
                </p>
              </div>

              {/* Predicted Level */}
              {currentLevel && (
                <div className="space-y-2">
                  <Label>Predicted Level</Label>
                  <div>
                    <Badge variant={getLevelColor(currentLevel) as any} className="text-sm">
                      {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional observations about the student's performance..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Assessment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Assessment Criteria */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Reading Assessment (1-10)</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>1-3 (Beginner):</strong> Recognizes basic letters, struggles with simple words</p>
                <p><strong>4-6 (Developing):</strong> Reads simple sentences, basic comprehension</p>
                <p><strong>7-10 (Proficient):</strong> Fluent reading, good comprehension skills</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Writing Assessment (1-10)</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>1-3 (Beginner):</strong> Basic letter formation, simple words</p>
                <p><strong>4-6 (Developing):</strong> Simple sentences, basic grammar</p>
                <p><strong>7-10 (Proficient):</strong> Complex sentences, good grammar and vocabulary</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;