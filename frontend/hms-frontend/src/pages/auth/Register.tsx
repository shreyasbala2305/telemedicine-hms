import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PATIENT" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Registered successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1600508774637-2f5a2d11a16e?auto=format&fit=crop&w=1200&q=80" title="CityCare Hospital" subtitle="Join our healthcare network">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full px-4 py-3 border rounded-lg" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-3 border rounded-lg" required />
          <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-lg" required />
          <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg">
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-semibold text-white ${loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"}`}>{loading ? "Creating..." : "Register"}</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <a href="/login" className="text-primary">Login</a></p>
      </div>
    </AuthLayout>
  );
}
