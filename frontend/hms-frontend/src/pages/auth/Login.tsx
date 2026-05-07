import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import { makeFakeToken, MOCK_MODE } from "../../config";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 CENTRALIZED ROLE REDIRECT
  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "/admin";
      case "RECEPTIONIST":
        return "/receptionist";
      case "DOCTOR":
        return "/doctor";
      case "PATIENT":
        return "/patient";
      default:
        return "/login";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 MOCK LOGIN MODE
      if (MOCK_MODE) {
        const fakeToken = makeFakeToken("ADMIN"); // change role for testing
        const payload = JSON.parse(atob(fakeToken.split(".")[1]));
        const role = payload.role;

        login(fakeToken, true);
        toast.success("Mock login successful");

        navigate(getDashboardRoute(role)); // ✅ FIXED
        return;
      }

      // 🌍 REAL LOGIN
      const data = await loginUser(email, password);

      const token = data.token;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      login(token, true);

      toast.success("Login successful");

      navigate(getDashboardRoute(role)); // ✅ FIXED

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1588776814546-ec7d7b1f4ba3?auto=format&fit=crop&w=1200&q=80"
      title="CityCare Hospital"
      subtitle="Excellence in healthcare, compassion in service."
    >
      <div className="bg-white rounded-2xl shadow p-6">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Login to HMS</h2>
          <p className="text-gray-500 text-sm">Enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              loading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary hover:bg-primary-600"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <a href="#" className="hover:text-primary">Forgot password?</a>
          <a href="/register" className="hover:text-primary">Create account</a>
        </div>

      </div>
    </AuthLayout>
  );
} 