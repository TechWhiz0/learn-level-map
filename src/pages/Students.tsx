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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Users,
  BookOpen,
  TrendingUp,
  Search,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Students = () => {
  const { user, logout } = useAuth();
  const {
    students,
    classes,
    addStudent,
    deleteStudent,
    getStatistics,
    getClassById,
    loading,
  } = useStudents();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    classId: classId || "",
    currentLevel: "beginner" as const,
    readingScore: 0,
    writingScore: 0,
    lastAssessment: "Not assessed",
    assessmentHistory: [],
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  const stats = getStatistics(classId || undefined);
  const classData = classId ? getClassById(classId) : null;

  // Update newStudent.classId when classId from URL changes
  useEffect(() => {
    setNewStudent((prev) => ({
      ...prev,
      classId: classId || "",
    }));
  }, [classId]);

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    // Filter by class if classId is provided
    if (classId && student.classId !== classId) {
      return false;
    }

    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === "all" || student.currentLevel === levelFilter;

    // Grade filter based on reading/writing scores
    let matchesGrade = true;
    if (gradeFilter !== "all") {
      const avgScore = (student.readingScore + student.writingScore) / 2;
      switch (gradeFilter) {
        case "A":
          matchesGrade = avgScore >= 90;
          break;
        case "B":
          matchesGrade = avgScore >= 80 && avgScore < 90;
          break;
        case "C":
          matchesGrade = avgScore >= 70 && avgScore < 80;
          break;
        case "D":
          matchesGrade = avgScore >= 60 && avgScore < 70;
          break;
        case "F":
          matchesGrade = avgScore < 60;
          break;
        case "Not Assessed":
          matchesGrade = student.lastAssessment === "Not assessed";
          break;
      }
    }

    return matchesSearch && matchesLevel && matchesGrade;
  });

  const handleAddStudent = async () => {
    try {
      if (!newStudent.name.trim()) {
        toast({
          title: "Error",
          description: "Please enter the student's name",
          variant: "destructive",
        });
        return;
      }

      if (!newStudent.classId) {
        toast({
          title: "Error",
          description: "Please select a class for the student",
          variant: "destructive",
        });
        return;
      }

      if (loading) {
        toast({
          title: "Error",
          description: "Please wait for data to load before adding a student.",
          variant: "destructive",
        });
        return;
      }

      await addStudent(newStudent);

      toast({
        title: "Success",
        description: "Student added successfully",
      });

      setNewStudent({
        name: "",
        classId: classId || "",
        currentLevel: "beginner",
        readingScore: 0,
        writingScore: 0,
        lastAssessment: "Not assessed",
        assessmentHistory: [],
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding student:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add student. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "F":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStudentGrade = (student: any) => {
    if (student.lastAssessment === "Not assessed") return "Not Assessed";

    const avgScore = (student.readingScore + student.writingScore) / 2;
    if (avgScore >= 90) return "A";
    if (avgScore >= 80) return "B";
    if (avgScore >= 70) return "C";
    if (avgScore >= 60) return "D";
    return "F";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {classId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/classes")}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {classId
                  ? `Students - ${classData?.name || "Class"}`
                  : "Students"}
              </h1>
              {classData && (
                <p className="text-sm text-muted-foreground">
                  Grade {classData.grade} • Section{" "}
                  {classData.name
                    .replace(/Grade \d+/, "")
                    .replace(/^(\d+)([A-Z])$/, "$2")}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {classId && (
              <Button
                onClick={() => navigate(`/class/${classId}`)}
                variant="outline"
              >
                View Class
              </Button>
            )}
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
                {classData ? classData.name : "All Classes"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Beginner Level
              </CardTitle>
              <BookOpen className="h-4 w-4 text-level-beginner" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-beginner">
                {stats.beginnerCount}
              </div>
              <p className="text-xs text-muted-foreground">Need support</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Proficient Level
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-level-proficient" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-proficient">
                {stats.proficientCount}
              </div>
              <p className="text-xs text-muted-foreground">High achievers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Assessments
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.recentAssessments}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search by Name */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by Level */}
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="developing">Developing</SelectItem>
                <SelectItem value="proficient">Proficient</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter by Grade */}
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="A">Grade A (90-100%)</SelectItem>
                <SelectItem value="B">Grade B (80-89%)</SelectItem>
                <SelectItem value="C">Grade C (70-79%)</SelectItem>
                <SelectItem value="D">Grade D (60-69%)</SelectItem>
                <SelectItem value="F">Grade F (Below 60%)</SelectItem>
                <SelectItem value="Not Assessed">Not Assessed</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchTerm || levelFilter !== "all" || gradeFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setLevelFilter("all");
                  setGradeFilter("all");
                }}
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {students.length} students
            {(searchTerm || levelFilter !== "all" || gradeFilter !== "all") && (
              <span className="ml-2">
                (filtered by{" "}
                {[
                  searchTerm && "name",
                  levelFilter !== "all" && "level",
                  gradeFilter !== "all" && "grade",
                ]
                  .filter(Boolean)
                  .join(", ")}
                )
              </span>
            )}
          </div>
        </div>

        {/* Add Student Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Student List</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's information below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Enter student name"
                  />
                </div>
                {!classId && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="class" className="text-right">
                      Class
                    </Label>
                    <Select
                      value={newStudent.classId}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, classId: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes
                          .filter((cls) => cls.teacherId === user?.id)
                          .map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {classId && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">
                      Class
                    </Label>
                    <div className="col-span-3 text-sm text-muted-foreground">
                      {classData?.name || "Loading..."}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="level" className="text-right">
                    Level
                  </Label>
                  <Select
                    value={newStudent.currentLevel}
                    onValueChange={(
                      value: "beginner" | "developing" | "proficient"
                    ) => setNewStudent({ ...newStudent, currentLevel: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="developing">Developing</SelectItem>
                      <SelectItem value="proficient">Proficient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddStudent}
                  disabled={
                    !newStudent.name.trim() || !newStudent.classId || loading
                  }
                >
                  {loading ? "Loading..." : "Add Student"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {students.length === 0
                  ? "No students yet"
                  : "No students found"}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {students.length === 0
                  ? "Start building your class by adding your first student."
                  : "Try adjusting your search terms or filters."}
              </p>
              {students.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Student
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getLevelColor(student.currentLevel)}>
                          {student.currentLevel.charAt(0).toUpperCase() +
                            student.currentLevel.slice(1)}
                        </Badge>
                        {student.lastAssessment !== "Not assessed" && (
                          <Badge
                            className={getGradeColor(getStudentGrade(student))}
                          >
                            Grade {getStudentGrade(student)}
                          </Badge>
                        )}
                      </div>
                      {!classId && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {student.className}
                        </p>
                      )}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Student</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {student.name}? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteStudent(student.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {student.lastAssessment !== "Not assessed" ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Reading:
                          </span>
                          <span className="font-medium">
                            {student.readingScore}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Writing:
                          </span>
                          <span className="font-medium">
                            {student.writingScore}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Last Assessment:
                          </span>
                          <span className="font-medium">
                            {new Date(
                              student.lastAssessment
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <Badge variant="secondary">Not assessed yet</Badge>
                      </div>
                    )}

                    <Button
                      onClick={() =>
                        navigate(`/assessment?student=${student.id}`)
                      }
                      className="w-full"
                      variant="outline"
                    >
                      Conduct Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
