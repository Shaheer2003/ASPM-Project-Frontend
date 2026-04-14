import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/Layout";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Manage Users", path: "/admin/manage-users" },
  { label: "Register User", path: "/admin/register-user" },
  { label: "System Settings", path: "#" },
];

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  userId: "",
  dob: "",
  gender: "",
  address: "",
};

export default function RegisterUser() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("Student");
  const [formValues, setFormValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const requiredKeys = useMemo(
    () => ["firstName", "lastName", "email", "department", "userId"],
    []
  );

  const hasError = (key) => touched[key] && !formValues[key].trim();

  const handleChange = (key, value) => {
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

    alert("User registered successfully");
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
                userType === type ? "tab-chip-active" : "hover:border-white hover:bg-white",
              ].join(" ")}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">First Name</span>
            <input className={inputClass("firstName")} value={formValues.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">Last Name</span>
            <input className={inputClass("lastName")} value={formValues.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">Email</span>
            <input className={inputClass("email")} value={formValues.email} onChange={(e) => handleChange("email", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">Phone</span>
            <input className={inputClass("phone")} value={formValues.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">Department</span>
            <input className={inputClass("department")} value={formValues.department} onChange={(e) => handleChange("department", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">
              {userType === "Student" ? "Student ID" : "Employee ID"}
            </span>
            <input className={inputClass("userId")} value={formValues.userId} onChange={(e) => handleChange("userId", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">Date of Birth (DD/MM/YYYY)</span>
            <input className={inputClass("dob")} value={formValues.dob} onChange={(e) => handleChange("dob", e.target.value)} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">Gender</span>
            <input className={inputClass("gender")} value={formValues.gender} onChange={(e) => handleChange("gender", e.target.value)} />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-[#5b7593]">Address</span>
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
      </form>
    </Layout>
  );
}
