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

export default function RegisterUser() {
  const { addStudent, addTeacher } = useAppData();
  const navigate = useNavigate();
  const [userType, setUserType] = useState("Student");
  const [formValues, setFormValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const requiredKeys = useMemo(() => {
    if (userType === "Student") {
      return ["firstName", "lastName", "email", "department", "userId", "classCode"];
    }

    return ["firstName", "lastName", "email", "department", "userId"];
  }, [userType]);

  const hasError = (key) => touched[key] && !formValues[key].trim();

  const handleChange = (key, value) => {
    setFeedback({ type: "", message: "" });
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFormValues(initialValues);
    setTouched({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextTouched = requiredKeys.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(nextTouched);

    const isValid = requiredKeys.every((key) => formValues[key].trim());
    if (!isValid) {
      return;
    }

    const name = `${formValues.firstName} ${formValues.lastName}`.trim();
    const payload = {
      name,
      email: formValues.email,
      department: formValues.department,
    };

    const result =
      userType === "Student"
        ? addStudent({
            ...payload,
            studentId: formValues.userId,
            classCode: formValues.classCode,
          })
        : addTeacher({
            ...payload,
            employeeId: formValues.userId,
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
      hasError(key)
        ? "border-red-500 focus:border-red-600 focus:ring-red-200"
        : "",
    ].join(" ");

  return (
    <Layout links={links}>
      <section className="glass-panel p-5">
        <h1 className="page-title">Register New User</h1>
        <p className="page-subtitle">Create student and teacher accounts with validated details.</p>
      </section>

      <form onSubmit={handleSubmit} className="glass-panel mt-4 p-5">
        <div className="mb-4 flex gap-2">
          {["Student", "Teacher"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
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
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">First Name</span>
            <input className={inputClass("firstName")} value={formValues.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
          </label>
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Last Name</span>
            <input className={inputClass("lastName")} value={formValues.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
          </label>
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Email</span>
            <input className={inputClass("email")} value={formValues.email} onChange={(e) => handleChange("email", e.target.value)} />
          </label>
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Phone</span>
            <input className={inputClass("phone")} value={formValues.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </label>
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Department</span>
            <input className={inputClass("department")} value={formValues.department} onChange={(e) => handleChange("department", e.target.value)} />
          </label>
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">
              {userType === "Student" ? "Student ID" : "Employee ID"}
            </span>
            <input className={inputClass("userId")} value={formValues.userId} onChange={(e) => handleChange("userId", e.target.value)} />
          </label>
          {userType === "Student" ? (
            <label>
              <span className="text-soft mb-1 block text-sm font-medium">Class</span>
              <input
                className={inputClass("classCode")}
                value={formValues.classCode}
                onChange={(e) => handleChange("classCode", e.target.value)}
                placeholder="e.g. SE303-A"
              />
            </label>
          ) : null}
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Date of Birth (DD/MM/YYYY)</span>
            <input className={inputClass("dob")} value={formValues.dob} onChange={(e) => handleChange("dob", e.target.value)} />
          </label>
          <label>
            <span className="text-soft mb-1 block text-sm font-medium">Gender</span>
            <input className={inputClass("gender")} value={formValues.gender} onChange={(e) => handleChange("gender", e.target.value)} />
          </label>
          <label className="md:col-span-2">
            <span className="text-soft mb-1 block text-sm font-medium">Address</span>
            <textarea
              className={inputClass("address")}
              rows={4}
              value={formValues.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-users")}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-ghost"
          >
            Reset Form
          </button>
          <button type="submit" className="btn-primary">
            Register User
          </button>
        </div>

        {feedback.message ? (
          <p
            className={[
              "mt-3 text-sm font-semibold",
              feedback.type === "error" ? "text-[var(--color-danger)]" : "text-emerald-700",
            ].join(" ")}
          >
            {feedback.message}
          </p>
        ) : null}
      </form>
    </Layout>
  );
}
