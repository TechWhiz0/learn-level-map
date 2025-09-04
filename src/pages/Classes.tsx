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
import {
  Dialog,
  DialogContent,
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Users,
  BookOpen,
  Edit,
  Trash2,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Classes = () => {
  const { user } = useAuth();
  const {
    classes,
    addClass,
    updateClass,
    deleteClass,
    getStudentsByClass,
    loading,
  } = useStudents();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    section: "",
  });

  // Filter classes for current teacher
  const teacherClasses = classes.filter((cls) => cls.teacherId === user?.id);

  const handleAddClass = async () => {
    if (!formData.grade || !formData.section) {
      toast({
        title: "Error",
        description: "Please select grade and section",
        variant: "destructive",
      });
      return;
    }

    if (loading) {
      toast({
        title: "Error",
        description: "Please wait for data to load before creating a class.",
        variant: "destructive",
      });
      return;
    }

    try {
      const className = `Grade ${formData.grade}${formData.section}`;
      await addClass({
        name: className,
        grade: formData.grade,
        subject: "General", // Default subject
        teacherId: user!.id,
        teacherName: user!.name,
      });

      toast({
        title: "Success",
        description: "Class created successfully",
      });

      setShowAddDialog(false);
      setFormData({ name: "", grade: "", section: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create class",
        variant: "destructive",
      });
    }
  };

  const handleEditClass = async () => {
    if (!editingClass || !formData.grade || !formData.section) {
      toast({
        title: "Error",
        description: "Please select grade and section",
        variant: "destructive",
      });
      return;
    }

    try {
      const className = `Grade ${formData.grade}${formData.section}`;
      await updateClass(editingClass.id, {
        name: className,
        grade: formData.grade,
        subject: "General", // Default subject
      });

      toast({
        title: "Success",
        description: "Class updated successfully",
      });

      setShowEditDialog(false);
      setEditingClass(null);
      setFormData({ name: "", grade: "", section: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await deleteClass(classId);
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (cls: any) => {
    setEditingClass(cls);
    // Extract grade and section from class name (e.g., "Grade 5A" -> grade: "5", section: "A")
    const match = cls.name.match(/Grade (\d+)([A-Z])/);
    const grade = match ? match[1] : "";
    const section = match ? match[2] : "";

    setFormData({
      name: cls.name,
      grade: grade,
      section: section,
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({ name: "", grade: "", section: "" });
    setEditingClass(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
              <p className="text-gray-600">Manage your classes and students</p>
            </div>
          </div>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Header with Add Class Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600">
              You have {teacherClasses.length} class
              {teacherClasses.length !== 1 ? "es" : ""}
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                {loading ? "Loading..." : "Add New Class"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) =>
                      setFormData({ ...formData, grade: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (grade) => (
                          <SelectItem key={grade} value={grade.toString()}>
                            Grade {grade}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="section">Section</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) =>
                      setFormData({ ...formData, section: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 26 }, (_, i) =>
                        String.fromCharCode(65 + i)
                      ).map((section) => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleAddClass}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Create Class"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Grid */}
        {teacherClasses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <GraduationCap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No classes yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first class to start managing students
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teacherClasses.map((cls) => {
              const classStudents = getStudentsByClass(cls.id);
              const stats = {
                total: classStudents.length,
                beginner: classStudents.filter(
                  (s) => s.currentLevel === "beginner"
                ).length,
                developing: classStudents.filter(
                  (s) => s.currentLevel === "developing"
                ).length,
                proficient: classStudents.filter(
                  (s) => s.currentLevel === "proficient"
                ).length,
              };

              return (
                <Card
                  key={cls.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{cls.name}</CardTitle>
                        <CardDescription>
                          Grade {cls.grade} • {cls.subject}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(cls)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Class</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{cls.name}"?
                                This will also delete all students in this
                                class. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClass(cls.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Class
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Student Count */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          {cls.studentCount} student
                          {cls.studentCount !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Level Distribution */}
                      {stats.total > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-level-beginner">
                              Beginner
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-level-beginner-light text-level-beginner"
                            >
                              {stats.beginner}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-level-developing">
                              Developing
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-level-developing-light text-level-developing"
                            >
                              {stats.developing}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-level-proficient">
                              Proficient
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-level-proficient-light text-level-proficient"
                            >
                              {stats.proficient}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <BookOpen className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">No students yet</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => navigate(`/class/${cls.id}`)}
                          className="flex-1"
                          size="sm"
                        >
                          View Class
                        </Button>
                        <Button
                          onClick={() =>
                            navigate(`/students?classId=${cls.id}`)
                          }
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          Manage Students
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Class Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editGrade">Grade</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) =>
                  setFormData({ ...formData, grade: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditClass} className="flex-1">
                Update Class
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
