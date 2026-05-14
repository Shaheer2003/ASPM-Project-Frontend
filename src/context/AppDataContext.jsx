import { createContext, useContext, useEffect, useMemo, useState } from "react";
import mockAuthUsers from "../data/mockAuthUsers";
import { apiRequest } from "../services/apiClient";

const AppDataContext = createContext(null);
const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

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

const normalizeStudent = (student) => ({
  id: student.id,
  name: student.name,
  email: student.email,
  classCode: student.classCode ?? student.class_code,
  department: student.department,
  phone: student.phone ?? "-",
  batch: student.batch ?? "",
});

const normalizeAttendanceSummary = (summary) => ({
  studentId: summary.studentId ?? summary.student_id,
  courseCode: summary.courseCode ?? summary.course_code,
  classCode: summary.classCode ?? summary.class_code,
  present: summary.present,
  total: summary.total,
  absent: summary.absent ?? (summary.total - summary.present),
  percentage: summary.percentage ?? 0,
});

const normalizeAttendanceRecord = (record) => ({
  id: record.id,
  studentId: record.studentId ?? record.student_id,
  classCode: record.classCode ?? record.class_code,
  courseCode: record.courseCode ?? record.course_code,
  date: record.date,
  session: record.session,
  status: record.status,
  teacherId: record.teacherId ?? record.teacher_id,
});

const normalizeMarksRecord = (record) => ({
  id: record.id,
  studentId: record.studentId ?? record.student_id,
  courseCode: record.courseCode ?? record.course_code,
  classCode: record.classCode ?? record.class_code,
  assessments: record.assessments,
  totals: record.totals,
  obtained: record.obtained,
  total: record.total,
  percentage: record.percentage,
  grade: record.grade,
});

export function AppDataProvider({ children }) {
  const [users, setUsers] = useState(seedUsers);
  const [students, setStudents] = useState(seedStudents);
  const [teachers, setTeachers] = useState(seedTeachers);
  const [courses, setCourses] = useState(seedCourses);
  const [attendanceRecords, setAttendanceRecords] = useState(seedAttendanceRecords);
  const [marksRecords, setMarksRecords] = useState(seedMarks);
  const [resetTokens, setResetTokens] = useState([]);
  const [loading, setLoading] = useState(!useMocks);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (useMocks) {
      setLoading(false);
      return;
    }

    const loadShared = async () => {
      try {
        const [coursesResponse, studentsResponse, summaryResponse] = await Promise.all([
          apiRequest("/api/shared/courses"),
          apiRequest("/api/shared/students"),
          apiRequest("/api/shared/attendance-summary"),
        ]);

        setCourses(coursesResponse.map((course) => ({
          code: course.code,
          name: course.name,
          classCode: course.classCode ?? course.class_code,
        })));
        setStudents(studentsResponse.map(normalizeStudent));
        setAttendanceRecords(summaryResponse?.summaries?.map(normalizeAttendanceSummary) || []);
      } catch (error) {
        setToast({ type: "error", message: error?.message || "Failed to load shared data." });
      } finally {
        setLoading(false);
      }
    };

    loadShared();
  }, []);

  const notify = (type, message) => {
    if (!message) {
      return;
    }
    setToast({ type, message });
  };

  const requestPasswordReset = async (email) => {
    if (useMocks) {
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
    }

    try {
      const response = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      return { ok: true, token: response.token, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to request reset token." };
    }
  };

  const resetPassword = async ({ token, newPassword }) => {
    if (useMocks) {
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
    }

    try {
      const response = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: { token, new_password: newPassword },
      });
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to reset password." };
    }
  };

  const loadUsers = async () => {
    if (useMocks) {
      return { ok: true, data: users };
    }

    try {
      const response = await apiRequest("/api/admin/users");
      const mapped = response.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
      }));
      setUsers(mapped);
      return { ok: true, data: mapped };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load users." };
    }
  };

  const addStudent = async ({ name, studentId, email, classCode, department }) => {
    if (useMocks) {
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
    }

    try {
      const response = await apiRequest("/api/admin/students", {
        method: "POST",
        body: {
          name,
          student_id: studentId,
          email,
          class_code: classCode,
          department,
        },
      });
      await loadUsers();
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to register student." };
    }
  };

  const addTeacher = async ({ name, employeeId, email, assignedClasses = [], department }) => {
    if (useMocks) {
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
    }

    try {
      const response = await apiRequest("/api/admin/teachers", {
        method: "POST",
        body: {
          name,
          employee_id: employeeId,
          email,
          department,
          assigned_classes: assignedClasses,
        },
      });
      await loadUsers();
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to register teacher." };
    }
  };

  const updateTeacher = async (id, payload) => {
    if (useMocks) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
              ...user,
              name: payload.name?.trim() || user.name,
              department: payload.department?.trim() || user.department,
            }
            : user
        )
      );
      return { ok: true, message: "Teacher record updated successfully." };
    }

    try {
      const response = await apiRequest(`/api/admin/teachers/${id}`, {
        method: "PUT",
        body: {
          name: payload.name,
          department: payload.department,
        },
      });
      await loadUsers();
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to update teacher." };
    }
  };

  const updateStudent = async (id, payload) => {
    if (useMocks) {
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
    }

    try {
      const response = await apiRequest(`/api/admin/students/${id}`, {
        method: "PUT",
        body: {
          name: payload.name,
          email: payload.email,
          class_code: payload.classCode,
          department: payload.department,
        },
      });
      await loadUsers();
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to update student." };
    }
  };

  const deleteOrArchiveStudent = async (id, mode = "archive") => {
    if (useMocks) {
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
    }

    try {
      const response = await apiRequest(`/api/admin/students/${id}?mode=${mode}`, {
        method: "DELETE",
      });
      await loadUsers();
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to update student." };
    }
  };

  const assignUserRole = async (userId, role) => {
    if (useMocks) {
      const user = users.find((entry) => entry.id === userId);
      if (!user) {
        return { ok: false, message: "User not found." };
      }

      setUsers((prev) => prev.map((entry) => (entry.id === userId ? { ...entry, role } : entry)));
      return { ok: true, message: "User role updated successfully." };
    }

    try {
      const response = await apiRequest(`/api/admin/users/${userId}/role?role=${role}`, {
        method: "POST",
      });
      await loadUsers();
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to update user role." };
    }
  };

  const fetchAdminDashboard = async () => {
    if (useMocks) {
      return {
        ok: true,
        data: {
          total_students: students.length,
          total_teachers: users.filter((user) => user.role === "Teacher").length,
          total_courses: courses.length,
        },
      };
    }

    try {
      const response = await apiRequest("/api/admin-reports/dashboard");
      return { ok: true, data: response };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load admin dashboard." };
    }
  };

  const fetchAdminAttendanceReports = async ({ studentId, classCode, date }) => {
    if (useMocks) {
      const rows = attendanceRecords.filter((record) => {
        const byStudent = !studentId || studentId === "ALL" || record.studentId === studentId;
        const byClass = !classCode || classCode === "ALL" || record.classCode === classCode;
        const byDate = !date || record.date === date;
        return byStudent && byClass && byDate;
      });
      const present = rows.filter((row) => row.status === "Present").length;
      const total = rows.length;
      return {
        ok: true,
        data: {
          records: rows,
          summary: {
            total,
            present,
            absent: total - present,
            percentage: total > 0 ? Number(((present / total) * 100).toFixed(0)) : 0,
          },
        },
      };
    }

    const query = new URLSearchParams();
    if (studentId && studentId !== "ALL") {
      query.set("student_id", studentId);
    }
    if (classCode && classCode !== "ALL") {
      query.set("class_code", classCode);
    }
    if (date) {
      query.set("date", date);
    }

    try {
      const response = await apiRequest(`/api/admin-reports/reports/attendance?${query}`);
      return {
        ok: true,
        data: {
          records: response.records.map(normalizeAttendanceRecord),
          summary: response.summary,
        },
      };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load attendance reports." };
    }
  };

  const fetchTeacherProfile = async () => {
    if (useMocks) {
      return { ok: true, data: teachers[0] || null };
    }

    try {
      const response = await apiRequest("/api/teacher/profile");
      return {
        ok: true,
        data: {
          id: response.id,
          name: response.name,
          email: response.email,
          assignedClasses: response.assigned_classes || [],
        },
      };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load teacher profile." };
    }
  };

  const fetchTeacherStudents = async (classCode) => {
    if (useMocks) {
      return {
        ok: true,
        data: students.filter((student) => student.classCode === classCode),
      };
    }

    try {
      const response = await apiRequest(`/api/teacher/students?class_code=${classCode}`);
      return { ok: true, data: response.map(normalizeStudent) };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load class students." };
    }
  };

  const fetchTeacherStudentOverview = async (studentId) => {
    if (useMocks) {
      const student = students.find((entry) => entry.id === studentId) || null;
      const markRows = marksRecords
        .filter((row) => row.studentId === studentId)
        .map((row) => ({ ...row, ...computeMarksSummary(row) }));
      const attendanceRows = attendanceRecords.filter((row) => row.studentId === studentId);

      return { ok: true, data: { student, markRows, attendanceRows } };
    }

    try {
      const response = await apiRequest(
        `/api/teacher/student-overview?student_id=${studentId}`
      );
      return {
        ok: true,
        data: {
          student: normalizeStudent(response.student),
          markRows: response.mark_rows?.map(normalizeMarksRecord) || [],
          attendanceRows:
            response.attendance_rows?.map(normalizeAttendanceSummary) || [],
        },
      };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load student overview." };
    }
  };

  const fetchTeacherAttendance = async ({ classCode, date }) => {
    if (useMocks) {
      return {
        ok: true,
        data: attendanceRecords.filter(
          (record) => record.classCode === classCode && (!date || record.date === date)
        ),
      };
    }

    const query = new URLSearchParams();
    if (classCode) {
      query.set("class_code", classCode);
    }
    if (date) {
      query.set("date", date);
    }

    try {
      const response = await apiRequest(`/api/teacher/attendance?${query}`);
      return { ok: true, data: response.records.map(normalizeAttendanceRecord) };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load attendance." };
    }
  };

  const markAttendance = async ({ classCode, date, session, entries }) => {
    if (useMocks) {
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
        teacherId: "",
      }));

      setAttendanceRecords((prev) => [...rows, ...prev]);
      return { ok: true, message: "Attendance saved successfully." };
    }

    try {
      const response = await apiRequest("/api/teacher/attendance", {
        method: "POST",
        body: {
          class_code: classCode,
          date,
          session,
          entries: entries.map((entry) => ({
            student_id: entry.studentId,
            status: entry.status,
          })),
        },
      });
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to save attendance." };
    }
  };

  const updateAttendanceRecord = async (recordId, status) => {
    if (useMocks) {
      setAttendanceRecords((prev) =>
        prev.map((record) => (record.id === recordId ? { ...record, status } : record))
      );
      return { ok: true, message: "Attendance updated successfully." };
    }

    try {
      const response = await apiRequest(`/api/teacher/attendance/${recordId}`, {
        method: "PUT",
        body: { status },
      });
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to update attendance." };
    }
  };

  const fetchTeacherMarks = async ({ classCode, courseCode }) => {
    if (useMocks) {
      return {
        ok: true,
        data: marksRecords
          .filter((record) =>
            record.classCode === classCode && record.courseCode === courseCode
          )
          .map((record) => ({
            ...record,
            ...computeMarksSummary(record),
          })),
      };
    }

    const query = new URLSearchParams();
    if (classCode) {
      query.set("class_code", classCode);
    }
    if (courseCode) {
      query.set("course_code", courseCode);
    }

    try {
      const response = await apiRequest(`/api/teacher/marks?${query}`);
      return { ok: true, data: response.records.map(normalizeMarksRecord) };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load marks." };
    }
  };

  const upsertMarksForClassAssessment = async ({ classCode, courseCode, assessment, rows }) => {
    if (useMocks) {
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
            };
          } else {
            next.push({
              id: `MRK-${Date.now()}-${row.studentId}`,
              studentId: row.studentId,
              courseCode,
              classCode,
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
    }

    try {
      const response = await apiRequest("/api/teacher/marks", {
        method: "POST",
        body: {
          class_code: classCode,
          course_code: courseCode,
          assessment,
          rows: rows.map((row) => ({
            student_id: row.studentId,
            obtained: row.obtained,
          })),
        },
      });
      return { ok: true, message: response.message };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to update marks." };
    }
  };

  const fetchStudentProfile = async () => {
    if (useMocks) {
      return { ok: true, data: { student: students[0], marks: [], attendance: [] } };
    }

    try {
      const response = await apiRequest("/api/student/profile");
      return {
        ok: true,
        data: {
          student: response.student ? normalizeStudent(response.student) : null,
          marks: response.marks?.map(normalizeMarksRecord) || [],
          attendance: response.attendance?.map(normalizeAttendanceSummary) || [],
        },
      };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load profile." };
    }
  };

  const fetchStudentAttendance = async () => {
    if (useMocks) {
      return {
        ok: true,
        data: {
          courses: attendanceRecords,
          dated_records: attendanceRecords,
          course_list: courses,
        },
      };
    }

    try {
      const response = await apiRequest("/api/student/attendance");
      return {
        ok: true,
        data: {
          courses: response.courses?.map(normalizeAttendanceSummary) || [],
          dated_records: response.dated_records?.map(normalizeAttendanceRecord) || [],
          course_list: response.course_list || [],
        },
      };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load attendance." };
    }
  };

  const fetchStudentMarks = async () => {
    if (useMocks) {
      const enriched = marksRecords.map((record) => ({
        ...record,
        ...computeMarksSummary(record),
      }));
      return { ok: true, data: { marks: enriched, courses } };
    }

    try {
      const response = await apiRequest("/api/student/marks");
      return {
        ok: true,
        data: {
          marks: response.marks?.map(normalizeMarksRecord) || [],
          courses: response.courses || [],
        },
      };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load marks." };
    }
  };

  const fetchStudentDashboard = async () => {
    if (useMocks) {
      const markRows = marksRecords.map((record) => ({
        ...record,
        ...computeMarksSummary(record),
      }));
      const attendanceRows = attendanceRecords;
      return {
        ok: true,
        data: {
          marks: markRows,
          attendance: attendanceRows,
          statistics: {
            total_courses: markRows.length,
            average_attendance: 0,
            average_marks: 0,
            cgpa: 0,
          },
        },
      };
    }

    try {
      const response = await apiRequest("/api/student/dashboard");
      return {
        ok: true,
        data: {
          marks: response.marks?.map(normalizeMarksRecord) || [],
          attendance: response.attendance?.map(normalizeAttendanceSummary) || [],
          statistics: response.statistics,
          student: response.student,
        },
      };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load dashboard." };
    }
  };

  const fetchStudentInsights = async () => {
    if (useMocks) {
      const marks = marksRecords.map((record) => ({
        ...record,
        ...computeMarksSummary(record),
      }));
      return { ok: true, data: { insights: marks } };
    }

    try {
      const response = await apiRequest("/api/student/insights");
      return { ok: true, data: response };
    } catch (error) {
      return { ok: false, message: error?.message || "Failed to load insights." };
    }
  };

  const value = useMemo(
    () => ({
      loading,
      toast,
      notify,
      users,
      students,
      teachers,
      courses,
      requestPasswordReset,
      resetPassword,
      loadUsers,
      addStudent,
      addTeacher,
      updateStudent,
      updateTeacher,
      deleteOrArchiveStudent,
      assignUserRole,
      fetchAdminDashboard,
      fetchAdminAttendanceReports,
      fetchTeacherProfile,
      fetchTeacherStudents,
      fetchTeacherStudentOverview,
      fetchTeacherAttendance,
      markAttendance,
      updateAttendanceRecord,
      fetchTeacherMarks,
      upsertMarksForClassAssessment,
      fetchStudentProfile,
      fetchStudentAttendance,
      fetchStudentMarks,
      fetchStudentDashboard,
      fetchStudentInsights,
    }),
    [
      loading,
      toast,
      users,
      students,
      teachers,
      courses,
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
