import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageUsers from "./components/admin/ManageUsers";
import RegisterUser from "./components/admin/RegisterUser";
import AttendanceReports from "./components/admin/AttendanceReports";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import MarkAttendance from "./components/teacher/MarkAttendance";
import ManageMarks from "./components/teacher/ManageMarks";
import StudentProfiles from "./components/teacher/StudentProfiles";
import TeacherReports from "./components/teacher/TeacherReports";
import StudentDashboard from "./components/student/StudentDashboard";
import MyProfile from "./components/student/MyProfile";
import AttendancePage from "./components/student/AttendancePage";
import MyMarks from "./components/student/MyMarks";
import PerformanceInsights from "./components/student/PerformanceInsights";
import NotFoundPage from "./components/shared/NotFoundPage";
import ProtectedRoute from "./components/shared/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/register-user"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <RegisterUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance-reports"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AttendanceReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={["Teacher"]}>
            <StudentProfiles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={["Teacher"]}>
            <MarkAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/marks"
        element={
          <ProtectedRoute allowedRoles={["Teacher"]}>
            <ManageMarks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/reports"
        element={
          <ProtectedRoute allowedRoles={["Teacher"]}>
            <TeacherReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/marks"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <MyMarks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/insights"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <PerformanceInsights />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
