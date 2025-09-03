import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, TrendingUp, BookOpen, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  currentLevel: 'beginner' | 'developing' | 'proficient';
  readingScore: number;
  writingScore: number;
  lastAssessment: string;
}

// Mock data for demonstration
const mockStudents: Student[] = [
  { id: '1', name: 'Priya Singh', rollNumber: 'R001', currentLevel: 'proficient', readingScore: 85, writingScore: 82, lastAssessment: '2024-11-15' },
  { id: '2', name: 'Rahul Kumar', rollNumber: 'R002', currentLevel: 'developing', readingScore: 72, writingScore: 68, lastAssessment: '2024-11-14' },
  { id: '3', name: 'Anita Sharma', rollNumber: 'R003', currentLevel: 'beginner', readingScore: 45, writingScore: 42, lastAssessment: '2024-11-13' },
  { id: '4', name: 'Arjun Patel', rollNumber: 'R004', currentLevel: 'proficient', readingScore: 88, writingScore: 85, lastAssessment: '2024-11-15' },
  { id: '5', name: 'Meera Gupta', rollNumber: 'R005', currentLevel: 'developing', readingScore: 65, writingScore: 70, lastAssessment: '2024-11-12' },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner': return 'bg-level-beginner-light text-level-beginner';
    case 'developing': return 'bg-level-developing-light text-level-developing';
    case 'proficient': return 'bg-level-proficient-light text-level-proficient';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getLevelLabel = (level: string) => {
  switch (level) {
    case 'beginner': return 'Beginner';
    case 'developing': return 'Developing';
    case 'proficient': return 'Proficient';
    default: return 'Unknown';
  }
};

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rollNumber) {
      toast({
        title: "Missing information",
        description: "Please enter both name and roll number",
        variant: "destructive"
      });
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      rollNumber: newStudent.rollNumber,
      currentLevel: 'beginner', // Default level
      readingScore: 0,
      writingScore: 0,
      lastAssessment: 'Not assessed'
    };

    setStudents([...students, student]);
    setNewStudent({ name: '', rollNumber: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Student added",
      description: `${student.name} has been added to your class`,
    });
  };

  const levelCounts = {
    beginner: students.filter(s => s.currentLevel === 'beginner').length,
    developing: students.filter(s => s.currentLevel === 'developing').length,
    proficient: students.filter(s => s.currentLevel === 'proficient').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Student Management</h1>
              <p className="text-muted-foreground">Manage your class roster and track student progress</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter the student's basic information to add them to your class
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      placeholder="Enter student's full name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      placeholder="Enter roll number (e.g., R006)"
                      value={newStudent.rollNumber}
                      onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddStudent} className="w-full">
                    Add Student
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beginner</CardTitle>
              <BookOpen className="h-4 w-4 text-level-beginner" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-beginner">{levelCounts.beginner}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Developing</CardTitle>
              <TrendingUp className="h-4 w-4 text-level-developing" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-developing">{levelCounts.developing}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proficient</CardTitle>
              <TrendingUp className="h-4 w-4 text-level-proficient" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-level-proficient">{levelCounts.proficient}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or roll number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Students Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-medium transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>Roll No: {student.rollNumber}</CardDescription>
                  </div>
                  <Badge className={getLevelColor(student.currentLevel)}>
                    {getLevelLabel(student.currentLevel)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reading:</span>
                    <span className="font-medium">{student.readingScore > 0 ? `${student.readingScore}%` : 'Not assessed'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Writing:</span>
                    <span className="font-medium">{student.writingScore > 0 ? `${student.writingScore}%` : 'Not assessed'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Assessment:</span>
                    <span className="font-medium text-xs">
                      {student.lastAssessment === 'Not assessed' ? student.lastAssessment : 
                       new Date(student.lastAssessment).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="pt-2 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/assessment?student=${student.id}`)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Assess
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Progress
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No students found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first student to the class'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Student
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;