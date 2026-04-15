import { createContext, useContext, useMemo, useState } from "react";
import mockAuthUsers from "../data/mockAuthUsers";

const AppDataContext = createContext(null);

const gradeFromPercentage = (percentage) => {
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A-";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 65) return "B-";
  if (percentage >= 60) return "C+";
  if (percentage >= 55) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

const asEmail = (value = "") => value.trim().toLowerCase();

const seedStudents = [
  {
    id: "22K-4169",
    name: "Tameema Rehman",
    email: "tameema.rehman@miniflex.edu",
    classCode: "SE303-A",
    department: "Computer Science",
    phone: "+92 300 1234567",
    batch: "2022-2026",
  },
  {
    id: "22K-4389",
    name: "Shaheer Mumtaz",
    email: "shaheer.mumtaz@miniflex.edu",
    classCode: "SE303-A",
    department: "Computer Science",
    phone: "+92 300 2234567",
    batch: "2022-2026",
  },
  {
    id: "22K-4396",
    name: "Ahmed Yoshay",
    email: "ahmed.yoshay@miniflex.edu",
    classCode: "CS301-B",
    department: "Computer Science",
    phone: "+92 300 3234567",
    batch: "2022-2026",
  },
  {
    id: "22L-6754",
    name: "Taha Tahir",
    email: "taha.tahir@miniflex.edu",
    classCode: "CS305-A",
    department: "Software Engineering",
    phone: "+92 300 4234567",
    batch: "2022-2026",
  },
  {
    id: "22K-4200",
    name: "Ayesha Tariq",
    email: "ayesha.tariq@miniflex.edu",
    classCode: "CS305-A",
    department: "Computer Science",
    phone: "+92 300 5234567",
    batch: "2022-2026",
  },
];

const seedTeachers = [
  {
    id: "EMP-1203",
    name: "Dr. Ayesha Malik",
    email: "ayesha.malik@miniflex.edu",
    assignedClasses: ["SE303-A", "CS301-B", "CS305-A"],
  },
  {
    id: "EMP-2204",
    name: "Sir Umer Khalid",
    email: "umer.khalid@miniflex.edu",
    assignedClasses: ["CS301-B"],
  },
  {
    id: "EMP-3305",
    name: "Ma'am Nida Shaikh",
    email: "nida.shaikh@miniflex.edu",
    assignedClasses: ["CS305-A"],
  },
];

const seedUsers = mockAuthUsers;

const seedCourses = [
  { code: "SE303", name: "Software Project Management", classCode: "SE303-A" },
  { code: "CS301", name: "Database Systems", classCode: "CS301-B" },
  { code: "CS305", name: "Operating Systems", classCode: "CS305-A" },
];

const seedAttendanceRecords = [
  {
    id: "ATT-1",
    studentId: "22K-4169",
    classCode: "SE303-A",
    courseCode: "SE303",
    date: "2026-04-10",
    session: "Morning",
    status: "Present",
    teacherId: "EMP-1203",
  },
  {
    id: "ATT-2",
    studentId: "22K-4169",
    classCode: "SE303-A",
    courseCode: "SE303",
    date: "2026-04-12",
    session: "Morning",
    status: "Absent",
    teacherId: "EMP-1203",
  },
  {
    id: "ATT-3",
    studentId: "22K-4389",
    classCode: "SE303-A",
    courseCode: "SE303",
    date: "2026-04-12",
    session: "Morning",
    status: "Present",
    teacherId: "EMP-1203",
  },
  {
    id: "ATT-4",
    studentId: "22K-4396",
    classCode: "CS301-B",
    courseCode: "CS301",
    date: "2026-04-11",
    session: "Evening",
    status: "Present",
    teacherId: "EMP-1203",
  },
];

const seedMarks = [
  {
    id: "MRK-1",
    studentId: "22K-4169",
    courseCode: "SE303",
    classCode: "SE303-A",
    assessments: { quiz: 8, assignment: 12, mid: 20, final: 41 },
    totals: { quiz: 10, assignment: 15, mid: 25, final: 50 },
    teacherId: "EMP-1203",
  },
  {
    id: "MRK-2",
    studentId: "22K-4389",
    courseCode: "SE303",
    classCode: "SE303-A",
    assessments: { quiz: 7, assignment: 11, mid: 18, final: 35 },
    totals: { quiz: 10, assignment: 15, mid: 25, final: 50 },
    teacherId: "EMP-1203",
  },
  {
    id: "MRK-3",
    studentId: "22K-4396",
    courseCode: "CS301",
    classCode: "CS301-B",
    assessments: { quiz: 9, assignment: 13, mid: 20, final: 39 },
    totals: { quiz: 10, assignment: 15, mid: 25, final: 50 },
    teacherId: "EMP-1203",
  },
];

const computeMarksSummary = (mark) => {
  const obtained =
    mark.assessments.quiz +
    mark.assessments.assignment +
    mark.assessments.mid +
    mark.assessments.final;
  const total =
    mark.totals.quiz + mark.totals.assignment + mark.totals.mid + mark.totals.final;
  const percentage = total > 0 ? Number(((obtained / total) * 100).toFixed(0)) : 0;
  const grade = gradeFromPercentage(percentage);

  return { obtained, total, percentage, grade };
};

export function AppDataProvider({ children }) {
  const [users, setUsers] = useState(seedUsers);
  const [students, setStudents] = useState(seedStudents);
  const [teachers] = useState(seedTeachers);
  const [courses] = useState(seedCourses);
  const [attendanceRecords, setAttendanceRecords] = useState(seedAttendanceRecords);
  const [marksRecords, setMarksRecords] = useState(seedMarks);
  const [resetTokens, setResetTokens] = useState([]);

  const authenticate = (username, password) => {
    const trimmed = username.trim().toLowerCase();
    const found = users.find(
      (user) => user.username.toLowerCase() === trimmed && user.password === password
    );

    if (!found) {
      return { ok: false, message: "Incorrect username or password." };
    }

    if (found.status === "Archived") {
      return { ok: false, message: "This account is archived." };
    }

    return {
      ok: true,
      user: {
        id: found.id,
        name: found.name,
        role: found.role,
        email: found.email,
      },
    };
  };

  const requestPasswordReset = (email) => {
    const normalized = asEmail(email);
    const user = users.find((entry) => asEmail(entry.email) === normalized);

    if (!user) {
      return { ok: false, message: "No user found with this email." };
    }

    const token = `RST-${Date.now()}`;
    setResetTokens((prev) => [
      ...prev.filter((entry) => entry.userId !== user.id),
      { token, userId: user.id, email: user.email },
    ]);

    return {
      ok: true,
      token,
      message: "Reset link generated. Use the token to reset your password.",
    };
  };

  const resetPassword = ({ token, newPassword }) => {
    const request = resetTokens.find((entry) => entry.token === token.trim());

    if (!request) {
      return { ok: false, message: "Invalid or expired reset token." };
    }

    if (newPassword.trim().length < 6) {
      return { ok: false, message: "Password must be at least 6 characters." };
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === request.userId ? { ...user, password: newPassword.trim() } : user
      )
    );
    setResetTokens((prev) => prev.filter((entry) => entry.token !== request.token));

    return { ok: true, message: "Password reset successfully." };
  };

  const addStudent = ({ name, studentId, email, classCode, department }) => {
    const trimmedId = studentId.trim();
    const trimmedEmail = asEmail(email);

    if (!name.trim() || !trimmedId || !trimmedEmail || !classCode.trim()) {
      return { ok: false, message: "Please fill all required fields." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { ok: false, message: "Invalid email format." };
    }

    if (students.some((student) => student.id.toLowerCase() === trimmedId.toLowerCase())) {
      return { ok: false, message: "Duplicate student ID is not allowed." };
    }

    const nextStudent = {
      id: trimmedId,
      name: name.trim(),
      email: trimmedEmail,
      classCode: classCode.trim(),
      department: department.trim() || "General",
      phone: "-",
      batch: "2022-2026",
    };

    setStudents((prev) => [nextStudent, ...prev]);
    setUsers((prev) => [
      ...prev,
      {
        id: nextStudent.id,
        username: trimmedId.toLowerCase(),
        password: "student123",
        role: "Student",
        name: nextStudent.name,
        email: nextStudent.email,
        status: "Active",
      },
    ]);

    return { ok: true, message: "Student record saved successfully." };
  };

  const addTeacher = ({ name, employeeId, email, assignedClasses = [] }) => {
    const trimmedId = employeeId.trim();
    const trimmedEmail = asEmail(email);

    if (!name.trim() || !trimmedId || !trimmedEmail) {
      return { ok: false, message: "Please fill all required fields." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { ok: false, message: "Invalid email format." };
    }

    if (users.some((user) => user.id.toLowerCase() === trimmedId.toLowerCase())) {
      return { ok: false, message: "Duplicate employee ID is not allowed." };
    }

    setUsers((prev) => [
      ...prev,
      {
        id: trimmedId,
        username: trimmedId.toLowerCase(),
        password: "teacher123",
        role: "Teacher",
        name: name.trim(),
        email: trimmedEmail,
        status: "Active",
      },
    ]);

    return { ok: true, message: "Teacher account saved successfully." };
  };

  const updateStudent = (id, payload) => {
    const existing = students.find((student) => student.id === id);
    if (!existing) {
      return { ok: false, message: "Student not found." };
    }

    const updatedEmail = asEmail(payload.email ?? existing.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedEmail)) {
      return { ok: false, message: "Invalid email format." };
    }

    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              name: payload.name?.trim() || student.name,
              email: updatedEmail,
              classCode: payload.classCode?.trim() || student.classCode,
              department: payload.department?.trim() || student.department,
            }
          : student
      )
    );

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              name: payload.name?.trim() || user.name,
              email: updatedEmail,
            }
          : user
      )
    );

    return { ok: true, message: "Student record updated successfully." };
  };

  const deleteOrArchiveStudent = (id, mode = "archive") => {
    if (mode === "delete") {
      setStudents((prev) => prev.filter((student) => student.id !== id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setAttendanceRecords((prev) => prev.filter((record) => record.studentId !== id));
      setMarksRecords((prev) => prev.filter((record) => record.studentId !== id));
      return { ok: true, message: "Student record deleted successfully." };
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id && user.role === "Student" ? { ...user, status: "Archived" } : user
      )
    );

    return { ok: true, message: "Student record archived successfully." };
  };

  const assignUserRole = (userId, role) => {
    const user = users.find((entry) => entry.id === userId);
    if (!user) {
      return { ok: false, message: "User not found." };
    }

    setUsers((prev) => prev.map((entry) => (entry.id === userId ? { ...entry, role } : entry)));
    return { ok: true, message: "User role updated successfully." };
  };

  const markAttendance = ({ teacherId, classCode, date, session, entries }) => {
    const duplicate = [];

    entries.forEach((entry) => {
      const exists = attendanceRecords.some(
        (record) =>
          record.studentId === entry.studentId &&
          record.classCode === classCode &&
          record.date === date
      );
      if (exists) {
        duplicate.push(entry.studentId);
      }
    });

    if (duplicate.length > 0) {
      return {
        ok: false,
        message: `Duplicate entries prevented for: ${duplicate.join(", ")}`,
      };
    }

    const courseCode = courses.find((course) => course.classCode === classCode)?.code || "GEN";

    const rows = entries.map((entry, index) => ({
      id: `ATT-${Date.now()}-${index}`,
      studentId: entry.studentId,
      classCode,
      courseCode,
      date,
      session,
      status: entry.status,
      teacherId,
    }));

    setAttendanceRecords((prev) => [...rows, ...prev]);
    return { ok: true, message: "Attendance saved successfully." };
  };

  const updateAttendanceRecord = (recordId, status) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.id === recordId ? { ...record, status } : record))
    );
    return { ok: true, message: "Attendance updated successfully." };
  };

  const upsertMarksForClassAssessment = ({
    teacherId,
    classCode,
    courseCode,
    assessment,
    rows,
  }) => {
    const keyMap = {
      "Quiz 1": "quiz",
      "Assignment 1": "assignment",
      "Mid Term": "mid",
      Final: "final",
    };

    const assessmentKey = keyMap[assessment];
    if (!assessmentKey) {
      return { ok: false, message: "Unknown assessment type." };
    }

    let validationError = null;
    rows.forEach((row) => {
      if (row.obtained < 0 || row.obtained > 100) {
        validationError = "Marks must be between 0 and 100.";
      }
    });

    if (validationError) {
      return { ok: false, message: validationError };
    }

    setMarksRecords((prev) => {
      const next = [...prev];
      rows.forEach((row) => {
        const index = next.findIndex(
          (record) => record.studentId === row.studentId && record.courseCode === courseCode
        );

        if (index >= 0) {
          next[index] = {
            ...next[index],
            assessments: {
              ...next[index].assessments,
              [assessmentKey]: Number(row.obtained),
            },
            teacherId,
          };
        } else {
          next.push({
            id: `MRK-${Date.now()}-${row.studentId}`,
            studentId: row.studentId,
            courseCode,
            classCode,
            teacherId,
            assessments: {
              quiz: 0,
              assignment: 0,
              mid: 0,
              final: 0,
              [assessmentKey]: Number(row.obtained),
            },
            totals: { quiz: 10, assignment: 15, mid: 25, final: 50 },
          });
        }
      });

      return next;
    });

    return { ok: true, message: "Marks updated successfully." };
  };

  const studentsByClass = useMemo(() => {
    const grouped = {};
    students.forEach((student) => {
      grouped[student.classCode] ||= [];
      grouped[student.classCode].push(student);
    });
    return grouped;
  }, [students]);

  const marksWithComputed = useMemo(
    () =>
      marksRecords.map((record) => {
        const summary = computeMarksSummary(record);
        return {
          ...record,
          ...summary,
        };
      }),
    [marksRecords]
  );

  const attendanceSummaryByStudent = useMemo(() => {
    const map = {};

    attendanceRecords.forEach((record) => {
      const key = `${record.studentId}-${record.courseCode}`;
      map[key] ||= {
        studentId: record.studentId,
        courseCode: record.courseCode,
        classCode: record.classCode,
        present: 0,
        total: 0,
      };
      map[key].total += 1;
      if (record.status === "Present") {
        map[key].present += 1;
      }
    });

    return Object.values(map).map((item) => {
      const percentage = item.total > 0 ? Number(((item.present / item.total) * 100).toFixed(0)) : 0;
      return { ...item, absent: item.total - item.present, percentage };
    });
  }, [attendanceRecords]);

  const getStudentOverview = (studentId) => {
    const student = students.find((entry) => entry.id === studentId) || null;
    const markRows = marksWithComputed.filter((row) => row.studentId === studentId);
    const attendanceRows = attendanceSummaryByStudent.filter(
      (row) => row.studentId === studentId
    );

    return { student, markRows, attendanceRows };
  };

  const getTeacherById = (teacherId) =>
    teachers.find((teacher) => teacher.id === teacherId) || null;

  const value = useMemo(
    () => ({
      users,
      students,
      teachers,
      courses,
      attendanceRecords,
      marksWithComputed,
      attendanceSummaryByStudent,
      studentsByClass,
      authenticate,
      requestPasswordReset,
      resetPassword,
      addStudent,
      addTeacher,
      updateStudent,
      deleteOrArchiveStudent,
      assignUserRole,
      markAttendance,
      updateAttendanceRecord,
      upsertMarksForClassAssessment,
      getStudentOverview,
      getTeacherById,
      gradeFromPercentage,
    }),
    [
      users,
      students,
      teachers,
      courses,
      attendanceRecords,
      marksWithComputed,
      attendanceSummaryByStudent,
      studentsByClass,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }

  return context;
}
