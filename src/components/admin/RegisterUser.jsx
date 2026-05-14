import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/Layout";
import { useAppData } from "../../context/AppDataContext";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Manage Users", path: "/admin/manage-users" },
  { label: "Register User", path: "/admin/register-user" },
  { label: "Attendance Reports", path: "/admin/attendance-reports" },
];

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  userId: "",
  classCode: "",
  dob: "",
  gender: "",
  address: "",
};

// ── Validation rules ──────────────────────────────────────────────────────────
const NAME_RE = /^[A-Za-z\s'.`-]+$/; // letters, spaces, apostrophes, hyphens only
const EMAIL_RE = /^[^\s@]+@miniflex\.edu$/i;
const PHONE_RE = /^03\d{9}$/; // starts with 03, exactly 11 digits

function validateField(key, value, userType) {
  const v = value.trim();

  switch (key) {
    case "firstName":
    case "lastName": {
      if (!v) return "This field is required.";
      if (!NAME_RE.test(v)) return "Name must contain letters only (no numbers or special characters).";
      return "";
    }
    case "email": {
      if (!v) return "Email is required.";
      if (!EMAIL_RE.test(v)) return "Email must end with @miniflex.edu.";
      return "";
    }
    case "phone": {
      if (!v) return ""; // phone is optional – only validate if filled
      if (!PHONE_RE.test(v)) return "Phone must start with 03 and be exactly 11 digits.";
      return "";
    }
    case "department": {
      if (!v) return "Department is required.";
      return "";
    }
    case "userId": {
      if (!v) return `${userType === "Student" ? "Student" : "Employee"} ID is required.`;
      return "";
    }
    case "classCode": {
      if (userType === "Student" && !v) return "Class code is required for students.";
      return "";
    }
    case "gender": {
      if (v && v !== "Male" && v !== "Female") return "Gender must be Male or Female.";
      return "";
    }
    default:
      return "";
  }
}

function validateAll(values, userType) {
  const requiredKeys =
    userType === "Student"
      ? ["firstName", "lastName", "email", "department", "userId", "classCode"]
      : ["firstName", "lastName", "email", "department", "userId"];

  const errors = {};
  Object.keys(values).forEach((key) => {
    const msg = validateField(key, values[key], userType);
    if (msg) errors[key] = msg;
  });

  // Mark all required fields as touched-like errors if empty
  requiredKeys.forEach((key) => {
    if (!errors[key] && !values[key].trim()) {
      errors[key] = "This field is required.";
    }
  });

  return errors;
}

export default function RegisterUser() {
  const { addStudent, addTeacher } = useAppData();
  const navigate = useNavigate();
  const [userType, setUserType] = useState("Student");
  const [formValues, setFormValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (key, value) => {
    setFeedback({ type: "", message: "" });
    setFormValues((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: validateField(key, value, userType),
      }));
    }
  };

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({
      ...prev,
      [key]: validateField(key, formValues[key], userType),
    }));
  };

  const handleReset = () => {
    setFormValues(initialValues);
    setTouched({});
    setErrors({});
    setFeedback({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allErrors = validateAll(formValues, userType);
    setErrors(allErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(initialValues).reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (Object.values(allErrors).some(Boolean)) return;

    const name = `${formValues.firstName.trim()} ${formValues.lastName.trim()}`;
    const payload = {
      name,
      email: formValues.email.trim().toLowerCase(),
      department: formValues.department.trim(),
    };

    const result =
      userType === "Student"
        ? await addStudent({
          ...payload,
          studentId: formValues.userId.trim(),
          classCode: formValues.classCode.trim(),
        })
        : await addTeacher({
          ...payload,
          employeeId: formValues.userId.trim(),
        });

    if (!result.ok) {
      setFeedback({ type: "error", message: result.message });
      return;
    }

    setFeedback({ type: "success", message: result.message });
    handleReset();
  };

  const inputClass = (key) =>
    [
      "input-glass",
      touched[key] && errors[key]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

  const FieldError = ({ fieldKey }) =>
    touched[fieldKey] && errors[fieldKey] ? (
      <span className="mt-1 block text-xs text-red-500">{errors[fieldKey]}</span>
    ) : null;

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Register New User</h1>
        <p className="page-subtitle">Create student and teacher accounts with validated details.</p>
      </section>

      <form onSubmit={handleSubmit} noValidate className="glass-panel mt-4 p-5">
        {/* User type tab */}
        <div className="mb-4 flex gap-2">
          {["Student", "Teacher"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setUserType(type);
                setErrors({});
                setTouched({});
              }}
              className={[
                "tab-chip",
                userType === type ? "tab-chip-active" : "hover:brightness-105",
              ].join(" ")}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* First Name */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">
              First Name <span className="text-red-500">*</span>
            </span>
            <input
              className={inputClass("firstName")}
              value={formValues.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              placeholder="e.g. Ayesha"
            />
            <FieldError fieldKey="firstName" />
          </label>

          {/* Last Name */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">
              Last Name <span className="text-red-500">*</span>
            </span>
            <input
              className={inputClass("lastName")}
              value={formValues.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              placeholder="e.g. Tariq"
            />
            <FieldError fieldKey="lastName" />
          </label>

          {/* Email */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </span>
            <input
              type="email"
              className={inputClass("email")}
              value={formValues.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="name@miniflex.edu"
            />
            <FieldError fieldKey="email" />
          </label>

          {/* Phone */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Phone</span>
            <input
              type="tel"
              className={inputClass("phone")}
              value={formValues.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="03XXXXXXXXX (11 digits)"
              maxLength={11}
            />
            <FieldError fieldKey="phone" />
          </label>

          {/* Department */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">
              Department <span className="text-red-500">*</span>
            </span>
            <input
              className={inputClass("department")}
              value={formValues.department}
              onChange={(e) => handleChange("department", e.target.value)}
              onBlur={() => handleBlur("department")}
              placeholder="e.g. Computer Science"
            />
            <FieldError fieldKey="department" />
          </label>

          {/* Student / Employee ID */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">
              {userType === "Student" ? "Student ID" : "Employee ID"}{" "}
              <span className="text-red-500">*</span>
            </span>
            <input
              className={inputClass("userId")}
              value={formValues.userId}
              onChange={(e) => handleChange("userId", e.target.value)}
              onBlur={() => handleBlur("userId")}
              placeholder={userType === "Student" ? "e.g. 22K-4169" : "e.g. EMP-1001"}
            />
            <FieldError fieldKey="userId" />
          </label>

          {/* Class Code – students only */}
          {userType === "Student" && (
            <label>
              <span className="text-soft mb-1 block text-sm font-medium">
                Class <span className="text-red-500">*</span>
              </span>
              <input
                className={inputClass("classCode")}
                value={formValues.classCode}
                onChange={(e) => handleChange("classCode", e.target.value)}
                onBlur={() => handleBlur("classCode")}
                placeholder="e.g. SE303-A"
              />
              <FieldError fieldKey="classCode" />
            </label>
          )}

          {/* Date of Birth */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Date of Birth</span>
            <input
              type="date"
              className={inputClass("dob")}
              value={formValues.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              onBlur={() => handleBlur("dob")}
            />
            <FieldError fieldKey="dob" />
          </label>

          {/* Gender – dropdown enforces Male/Female only */}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Gender</span>
            <select
              className={inputClass("gender")}
              value={formValues.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              onBlur={() => handleBlur("gender")}
            >
              <option value="">Select gender…</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <FieldError fieldKey="gender" />
          </label>

          {/* Address */}
          <label className="md:col-span-2">
            <span className="text-soft mb-1 block text-sm font-medium">Address</span>
            <textarea
              className={inputClass("address")}
              rows={3}
              value={formValues.address}
              onChange={(e) => handleChange("address", e.target.value)}
              onBlur={() => handleBlur("address")}
              placeholder="Street, City, Country"
            />
            <FieldError fieldKey="address" />
          </label>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-users")}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button type="button" onClick={handleReset} className="btn-ghost">
            Reset Form
          </button>
          <button type="submit" className="btn-primary">
            Register {userType}
          </button>
        </div>

        {feedback.message ? (
          <p
            className={[
              "mt-3 text-sm font-semibold",
              feedback.type === "error" ? "text-[var(--color-danger)]" : "text-emerald-600",
            ].join(" ")}
          >
            {feedback.message}
          </p>
        ) : null}
      </form>
    </Layout>
  );
}
