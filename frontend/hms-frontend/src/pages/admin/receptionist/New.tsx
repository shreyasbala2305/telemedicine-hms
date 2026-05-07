import React, { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../../services/authService";

export default function ReceptionistNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // 🔥 VALIDATION
  const validate = () => {
    const err: any = {};

    if (!form.name.trim()) err.name = "Name is required";

    if (!form.email.trim()) {
      err.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      err.email = "Invalid email format";
    }

    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 6) {
      err.password = "Minimum 6 characters required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (k: string, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await registerUser({
        ...form,
        role: "RECEPTIONIST" // 🔥 force role
      });

      toast.success("Receptionist created successfully");
      navigate("/admin");

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">Add Receptionist</h1>

      <div className="max-w-xl bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mt-1 dark:bg-gray-800"
              placeholder="Enter name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={form.email}
              onChange={e => handleChange("email", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mt-1 dark:bg-gray-800"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => handleChange("password", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mt-1 dark:bg-gray-800"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Creating..." : "Create Receptionist"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>

    </DashboardLayout>
  );
}