import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  CheckCircle,
  Info,
  HelpCircle,
} from "lucide-react";

const Assessment = () => {
  const { user, logout } = useAuth();
  const { students, classes, updateStudent } = useStudents();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [readingScore, setReadingScore] = useState<number>(0);
  const [writingScore, setWritingScore] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<
    "beginner" | "developing" | "proficient"
  >("beginner");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThresholdGuide, setShowThresholdGuide] = useState(false);

  // Get pre-selected student from URL params
  useEffect(() => {
    const studentId = searchParams.get("studentId");
    if (studentId) {
      setSelectedStudent(studentId);
    }
  }, [searchParams]);

  // Get all students for assessment (filtered by class if selected)
  const availableStudents =
    selectedClass && selectedClass !== "all"
      ? students.filter((student) => student.classId === selectedClass)
      : students;

  // Auto-calculate level based on scores
  useEffect(() => {
    if (readingScore > 0 && writingScore > 0) {
      const averageScore = (readingScore + writingScore) / 2;
      if (averageScore >= 80) {
        setCurrentLevel("proficient");
      } else if (averageScore >= 60) {
        setCurrentLevel("developing");
      } else {
        setCurrentLevel("beginner");
      }
    }
  }, [readingScore, writingScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive",
      });
      return;
    }

    if (
      readingScore < 0 ||
      readingScore > 100 ||
      writingScore < 0 ||
      writingScore > 100
    ) {
      toast({
        title: "Error",
        description: "Scores must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateStudent(selectedStudent, {
        readingScore,
        writingScore,
        currentLevel,
        lastAssessment: new Date().toISOString().split("T")[0],
      });

      toast({
        title: "Success",
        description: "Assessment submitted successfully",
      });

      // Reset form
      setReadingScore(0);
      setWritingScore(0);
      setCurrentLevel("beginner");
      setNotes("");

      // Navigate back to appropriate page
      if (selectedClass && selectedClass !== "all") {
        navigate(`/class/${selectedClass}`);
      } else {
        navigate("/students");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedStudentData = () => {
    return students.find((student) => student.id === selectedStudent);
  };

  const selectedStudentData = getSelectedStudentData();

  // Scoring threshold guide data
  const scoringGuide = [
    {
      level: "Beginner",
      scoreRange: "0-59%",
      color: "bg-level-beginner-light text-level-beginner",
      description: "Basic understanding, needs significant support",
      readingCriteria: "Recognizes basic letters, struggles with simple words",
      writingCriteria: "Basic letter formation, simple words",
    },
    {
      level: "Developing",
      scoreRange: "60-79%",
      color: "bg-level-developing-light text-level-developing",
      description: "Growing skills, moderate support needed",
      readingCriteria: "Reads simple sentences, basic comprehension",
      writingCriteria: "Simple sentences, basic grammar",
    },
    {
      level: "Proficient",
      scoreRange: "80-100%",
      color: "bg-level-proficient-light text-level-proficient",
      description: "Strong skills, minimal support needed",
      readingCriteria: "Fluent reading, good comprehension skills",
      writingCriteria: "Complex sentences, good grammar and vocabulary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/students")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Student Assessment</h1>
              <p className="text-muted-foreground">
                Evaluate student performance and track progress
              </p>
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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                New Assessment
              </CardTitle>
              <CardDescription>
                Select a student and enter their assessment scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No students available
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You need to add students before conducting assessments.
                  </p>
                  <Button onClick={() => navigate("/students")}>
                    Go to Students
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Class Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="class">Select Class (Optional)</Label>
                    <Select
                      value={selectedClass}
                      onValueChange={(value) => {
                        setSelectedClass(value);
                        setSelectedStudent(""); // Reset student selection when class changes
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a class to filter students" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes
                          .filter((cls) => cls.teacherId === user?.id && cls.id)
                          .map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Student Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="student">Select Student *</Label>
                    <Select
                      value={selectedStudent}
                      onValueChange={setSelectedStudent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student to assess" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStudents
                          .filter((student) => student.id)
                          .map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name}
                              {student.className && ` - ${student.className}`}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Student Info */}
                  {selectedStudentData && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Student Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="ml-2 font-medium">
                            {selectedStudentData.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Current Level:
                          </span>
                          <span className="ml-2 font-medium capitalize">
                            {selectedStudentData.currentLevel}
                          </span>
                        </div>
                        {selectedStudentData.lastAssessment !==
                          "Not assessed" && (
                          <>
                            <div>
                              <span className="text-muted-foreground">
                                Last Reading:
                              </span>
                              <span className="ml-2 font-medium">
                                {selectedStudentData.readingScore}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Last Writing:
                              </span>
                              <span className="ml-2 font-medium">
                                {selectedStudentData.writingScore}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Assessment Scores */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Assessment Scores
                      </Label>
                      <Dialog
                        open={showThresholdGuide}
                        onOpenChange={setShowThresholdGuide}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <HelpCircle className="h-4 w-4" />
                            Scoring Guide
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Info className="h-5 w-5" />
                              Assessment Scoring Guide
                            </DialogTitle>
                            <DialogDescription>
                              Use this guide to understand score ranges and
                              skill levels
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {scoringGuide.map((level, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <Badge className={level.color}>
                                    {level.level}
                                  </Badge>
                                  <span className="font-semibold text-lg">
                                    {level.scoreRange}
                                  </span>
                                </div>
                                <p className="text-muted-foreground mb-3">
                                  {level.description}
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h5 className="font-medium mb-2 text-foreground">
                                      Reading Criteria:
                                    </h5>
                                    <p className="text-muted-foreground">
                                      {level.readingCriteria}
                                    </p>
                                  </div>
                                  <div>
                                    <h5 className="font-medium mb-2 text-foreground">
                                      Writing Criteria:
                                    </h5>
                                    <p className="text-muted-foreground">
                                      {level.writingCriteria}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-medium text-blue-900 mb-2">
                                💡 Scoring Tips:
                              </h4>
                              <ul className="text-sm text-blue-800 space-y-1">
                                <li>
                                  • Reading and Writing scores are averaged to
                                  determine level
                                </li>
                                <li>• 80%+ average = Proficient level</li>
                                <li>• 60-79% average = Developing level</li>
                                <li>• Below 60% average = Beginner level</li>
                                <li>
                                  • Level updates automatically based on scores
                                </li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="readingScore">Reading Score *</Label>
                        <Input
                          id="readingScore"
                          type="number"
                          min="0"
                          max="100"
                          value={readingScore}
                          onChange={(e) =>
                            setReadingScore(Number(e.target.value))
                          }
                          placeholder="0-100"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="writingScore">Writing Score *</Label>
                        <Input
                          id="writingScore"
                          type="number"
                          min="0"
                          max="100"
                          value={writingScore}
                          onChange={(e) =>
                            setWritingScore(Number(e.target.value))
                          }
                          placeholder="0-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Auto-calculated Level Display */}
                    {readingScore > 0 && writingScore > 0 && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Suggested Level:
                          </span>
                          <Badge className={getLevelColor(currentLevel)}>
                            {currentLevel.charAt(0).toUpperCase() +
                              currentLevel.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on average score:{" "}
                          {Math.round((readingScore + writingScore) / 2)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Current Level Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="currentLevel">Current Skill Level *</Label>
                    <Select
                      value={currentLevel}
                      onValueChange={(
                        value: "beginner" | "developing" | "proficient"
                      ) => setCurrentLevel(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select current level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="developing">Developing</SelectItem>
                        <SelectItem value="proficient">Proficient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Assessment Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional observations or comments..."
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedStudent || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Assessment
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to get level color
const getLevelColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "bg-level-beginner-light text-level-beginner";
    case "developing":
      return "bg-level-developing-light text-level-developing";
    case "proficient":
      return "bg-level-proficient-light text-level-proficient";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default Assessment;
