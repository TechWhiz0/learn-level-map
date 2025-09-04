import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Interface for Class
export interface Class {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  grade: string;
  subject: string;
  createdAt: string;
  studentCount: number;
}

// Interface for Student
export interface Student {
  id: string;
  name: string;
  classId: string;
  className: string;
  currentLevel: "beginner" | "developing" | "proficient";
  readingScore: number;
  writingScore: number;
  lastAssessment: string;
  assessmentHistory: Array<{
    date: string;
    readingScore: number;
    writingScore: number;
    level: "beginner" | "developing" | "proficient";
  }>;
}

// Interface for Statistics
interface Statistics {
  totalStudents: number;
  beginnerCount: number;
  developingCount: number;
  proficientCount: number;
  needSupportCount: number;
  recentAssessments: number;
}

// Interface for Progress Data
interface ProgressData {
  month: string;
  beginner: number;
  developing: number;
  proficient: number;
}

// Interface for Student Progress Data
interface StudentProgressData {
  month: string;
  readingScore: number;
  writingScore: number;
  level: "beginner" | "developing" | "proficient";
}

// Interface for Class Statistics
interface ClassStatistics {
  totalStudents: number;
  beginnerCount: number;
  developingCount: number;
  proficientCount: number;
  needSupportCount: number;
  recentAssessments: number;
  averageReadingScore: number;
  averageWritingScore: number;
}

// Interface for Students Context
interface StudentsContextType {
  classes: Class[];
  students: Student[];
  addClass: (
    classData: Omit<Class, "id" | "createdAt" | "studentCount">
  ) => Promise<void>;
  updateClass: (classId: string, classData: Partial<Class>) => Promise<void>;
  deleteClass: (classId: string) => Promise<void>;
  addStudent: (studentData: Omit<Student, "id" | "className">) => Promise<void>;
  updateStudent: (
    studentId: string,
    studentData: Partial<Student>
  ) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
  getStudentById: (studentId: string) => Student | undefined;
  getClassById: (classId: string) => Class | undefined;
  getStudentsByClass: (classId: string) => Student[];
  getStatistics: (classId?: string) => Statistics;
  getClassStatistics: (classId: string) => ClassStatistics;
  getProgressData: (
    classId?: string,
    showAllMonths?: boolean
  ) => ProgressData[];
  getStudentProgressData: (studentId: string) => StudentProgressData[];
  loading: boolean;
}

// Create Context
const StudentsContext = createContext<StudentsContextType | undefined>(
  undefined
);

// Provider Component
export const StudentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Class
  const addClass = async (
    classData: Omit<Class, "id" | "createdAt" | "studentCount">
  ) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      studentCount: 0,
    };

    await setDoc(doc(db, "classes", newClass.id), newClass);
  };

  // Update Class
  const updateClass = async (classId: string, classData: Partial<Class>) => {
    const classRef = doc(db, "classes", classId);
    await setDoc(classRef, classData, { merge: true });
  };

  // Delete Class
  const deleteClass = async (classId: string) => {
    // First delete all students in this class
    const classStudents = students.filter(
      (student) => student.classId === classId
    );
    for (const student of classStudents) {
      await deleteDoc(doc(db, "students", student.id));
    }

    // Then delete the class
    await deleteDoc(doc(db, "classes", classId));
  };

  // Add Student
  const addStudent = async (studentData: Omit<Student, "id" | "className">) => {
    // Validate that classId is provided
    if (!studentData.classId) {
      throw new Error(
        "Class ID is required to add a student. Please select a class."
      );
    }

    // First check if the class exists in our local state
    let classData = classes.find((c) => c.id === studentData.classId);

    // If not found locally, try to fetch it directly from Firestore
    if (!classData) {
      try {
        const classDoc = await getDoc(doc(db, "classes", studentData.classId));
        if (classDoc.exists()) {
          classData = { id: classDoc.id, ...classDoc.data() } as Class;
        }
      } catch (error) {
        console.error("Error fetching class from Firestore:", error);
      }
    }

    if (!classData) {
      throw new Error(
        `Class with ID "${studentData.classId}" not found. Please refresh the page and try again.`
      );
    }

    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      className: classData.name,
    };

    await setDoc(doc(db, "students", newStudent.id), newStudent);

    // Update class student count
    await updateClass(studentData.classId, {
      studentCount: classData.studentCount + 1,
    });
  };

  // Update Student
  const updateStudent = async (
    studentId: string,
    studentData: Partial<Student>
  ) => {
    const studentRef = doc(db, "students", studentId);

    if (
      studentData.readingScore !== undefined &&
      studentData.writingScore !== undefined
    ) {
      const averageScore =
        (studentData.readingScore + studentData.writingScore) / 2;
      let newLevel: "beginner" | "developing" | "proficient";

      if (averageScore >= 80) {
        newLevel = "proficient";
      } else if (averageScore >= 60) {
        newLevel = "developing";
      } else {
        newLevel = "beginner";
      }

      const assessmentEntry = {
        date: new Date().toISOString().split("T")[0],
        readingScore: studentData.readingScore,
        writingScore: studentData.writingScore,
        level: newLevel,
      };

      const currentStudent = students.find((s) => s.id === studentId);
      if (currentStudent) {
        const updatedAssessmentHistory = [
          ...(currentStudent.assessmentHistory || []),
          assessmentEntry,
        ];

        await setDoc(
          studentRef,
          {
            ...studentData,
            currentLevel: newLevel,
            assessmentHistory: updatedAssessmentHistory,
            lastAssessment: new Date().toISOString().split("T")[0],
          },
          { merge: true }
        );
      }
    } else {
      await setDoc(studentRef, studentData, { merge: true });
    }
  };

  // Delete Student
  const deleteStudent = async (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      await deleteDoc(doc(db, "students", studentId));

      // Update class student count
      const classData = classes.find((c) => c.id === student.classId);
      if (classData) {
        await updateClass(student.classId, {
          studentCount: Math.max(0, classData.studentCount - 1),
        });
      }
    }
  };

  // Get Student by ID
  const getStudentById = (studentId: string) => {
    return students.find((student) => student.id === studentId);
  };

  // Get Class by ID
  const getClassById = (classId: string) => {
    return classes.find((cls) => cls.id === classId);
  };

  // Get Students by Class
  const getStudentsByClass = (classId: string) => {
    return students.filter((student) => student.classId === classId);
  };

  // Get Statistics (can be filtered by class)
  const getStatistics = (classId?: string) => {
    const targetStudents = classId
      ? students.filter((student) => student.classId === classId)
      : students;

    if (targetStudents.length === 0) {
      return {
        totalStudents: 0,
        beginnerCount: 0,
        developingCount: 0,
        proficientCount: 0,
        needSupportCount: 0,
        recentAssessments: 0,
      };
    }

    const currentDate = new Date();
    const thirtyDaysAgo = new Date(
      currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    const beginnerCount = targetStudents.filter(
      (student) => student.currentLevel === "beginner"
    ).length;

    const developingCount = targetStudents.filter(
      (student) => student.currentLevel === "developing"
    ).length;

    const proficientCount = targetStudents.filter(
      (student) => student.currentLevel === "proficient"
    ).length;

    const needSupportCount = targetStudents.filter(
      (student) => student.currentLevel === "beginner"
    ).length;

    const recentAssessments = targetStudents.filter((student) => {
      if (!student.lastAssessment) return false;
      const lastAssessmentDate = new Date(student.lastAssessment);
      return lastAssessmentDate >= thirtyDaysAgo;
    }).length;

    return {
      totalStudents: targetStudents.length,
      beginnerCount,
      developingCount,
      proficientCount,
      needSupportCount,
      recentAssessments,
    };
  };

  // Get Class Statistics
  const getClassStatistics = (classId: string) => {
    const classStudents = students.filter(
      (student) => student.classId === classId
    );

    if (classStudents.length === 0) {
      return {
        totalStudents: 0,
        beginnerCount: 0,
        developingCount: 0,
        proficientCount: 0,
        needSupportCount: 0,
        recentAssessments: 0,
        averageReadingScore: 0,
        averageWritingScore: 0,
      };
    }

    const stats = getStatistics(classId);

    const totalReadingScore = classStudents.reduce(
      (sum, student) => sum + student.readingScore,
      0
    );
    const totalWritingScore = classStudents.reduce(
      (sum, student) => sum + student.writingScore,
      0
    );

    return {
      ...stats,
      averageReadingScore: Math.round(totalReadingScore / classStudents.length),
      averageWritingScore: Math.round(totalWritingScore / classStudents.length),
    };
  };

  // Get Progress Data (can be filtered by class)
  const getProgressData = (
    classId?: string,
    showAllMonths: boolean = false
  ) => {
    const targetStudents = classId
      ? students.filter((student) => student.classId === classId)
      : students;

    if (targetStudents.length === 0) return [];

    // Get current year to filter out previous years
    const currentYear = new Date().getFullYear();

    // Get all unique assessment months from student data (current year only)
    const assessmentMonths = new Set<string>();

    targetStudents.forEach((student) => {
      if (student.assessmentHistory && student.assessmentHistory.length > 0) {
        student.assessmentHistory.forEach((assessment) => {
          const date = new Date(assessment.date);
          // Only include months from current year
          if (date.getFullYear() === currentYear) {
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            assessmentMonths.add(monthKey);
          }
        });
      }
    });

    // If showAllMonths is true, include all months of current year
    if (showAllMonths) {
      for (let month = 0; month < 12; month++) {
        const monthKey = `${currentYear}-${month}`;
        assessmentMonths.add(monthKey);
      }
    }

    // If no assessments in current year, return empty array
    if (assessmentMonths.size === 0) return [];

    // Convert month keys to readable format and sort chronologically
    const sortedMonths = Array.from(assessmentMonths)
      .map((monthKey) => {
        const [year, month] = monthKey.split("-").map(Number);
        return {
          month: new Date(year, month, 1).toLocaleDateString("en-US", {
            month: "short",
          }),
          date: new Date(year, month, 1),
          monthKey,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Generate progress data for each month
    return sortedMonths.map((monthInfo) => {
      const monthStart = new Date(
        monthInfo.date.getFullYear(),
        monthInfo.date.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthInfo.date.getFullYear(),
        monthInfo.date.getMonth() + 1,
        0
      );

      let beginner = 0;
      let developing = 0;
      let proficient = 0;

      targetStudents.forEach((student) => {
        if (student.assessmentHistory && student.assessmentHistory.length > 0) {
          // Find assessments in this month
          const relevantAssessments = student.assessmentHistory.filter(
            (assessment) => {
              const assessmentDate = new Date(assessment.date);
              return assessmentDate >= monthStart && assessmentDate <= monthEnd;
            }
          );

          if (relevantAssessments.length > 0) {
            // Use the latest assessment in this month
            const latestAssessment =
              relevantAssessments[relevantAssessments.length - 1];
            switch (latestAssessment.level) {
              case "beginner":
                beginner++;
                break;
              case "developing":
                developing++;
                break;
              case "proficient":
                proficient++;
                break;
            }
          }
        }
      });

      return {
        month: monthInfo.month,
        beginner,
        developing,
        proficient,
      };
    });
  };

  // Get Student Progress Data
  const getStudentProgressData = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student || !student.assessmentHistory) return [];

    const currentYear = new Date().getFullYear();
    const assessmentMonths = new Set<string>();

    student.assessmentHistory.forEach((assessment) => {
      const date = new Date(assessment.date);
      if (date.getFullYear() === currentYear) {
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        assessmentMonths.add(monthKey);
      }
    });

    if (assessmentMonths.size === 0) return [];

    const sortedMonths = Array.from(assessmentMonths)
      .map((monthKey) => {
        const [year, month] = monthKey.split("-").map(Number);
        return {
          month: new Date(year, month, 1).toLocaleDateString("en-US", {
            month: "short",
          }),
          date: new Date(year, month, 1),
          monthKey,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return sortedMonths.map((monthInfo) => {
      const monthStart = new Date(
        monthInfo.date.getFullYear(),
        monthInfo.date.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthInfo.date.getFullYear(),
        monthInfo.date.getMonth() + 1,
        0
      );

      const relevantAssessments = student.assessmentHistory.filter(
        (assessment) => {
          const assessmentDate = new Date(assessment.date);
          return assessmentDate >= monthStart && assessmentDate <= monthEnd;
        }
      );

      if (relevantAssessments.length > 0) {
        const latestAssessment =
          relevantAssessments[relevantAssessments.length - 1];
        return {
          month: monthInfo.month,
          readingScore: latestAssessment.readingScore,
          writingScore: latestAssessment.writingScore,
          level: latestAssessment.level,
        };
      }

      return {
        month: monthInfo.month,
        readingScore: 0,
        writingScore: 0,
        level: "beginner" as const,
      };
    });
  };

  // Fetch data from Firestore
  useEffect(() => {
    // We need to get the current user to filter classes and students
    // For now, we'll fetch all data and filter in the components
    // In a production app, you'd want to use security rules and queries
    const unsubscribeClasses = onSnapshot(
      collection(db, "classes"),
      (snapshot) => {
        const classesData: Class[] = [];
        snapshot.forEach((doc) => {
          classesData.push({ id: doc.id, ...doc.data() } as Class);
        });
        setClasses(classesData);
      }
    );

    const unsubscribeStudents = onSnapshot(
      collection(db, "students"),
      (snapshot) => {
        const studentsData: Student[] = [];
        snapshot.forEach((doc) => {
          studentsData.push({ id: doc.id, ...doc.data() } as Student);
        });
        setStudents(studentsData);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeClasses();
      unsubscribeStudents();
    };
  }, []);

  const value: StudentsContextType = {
    classes,
    students,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getClassById,
    getStudentsByClass,
    getStatistics,
    getClassStatistics,
    getProgressData,
    getStudentProgressData,
    loading,
  };

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
};

// Hook to use Students Context
export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentsProvider");
  }
  return context;
};
