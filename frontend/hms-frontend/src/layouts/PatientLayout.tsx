import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationPanel from "../components/widgets/NotificationPanel";
import MobileSidebar from "../components/ui/MobileSidebar";
import { Menu, Moon, Sun } from "lucide-react";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { logout, token } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // 🔥 Extract user info from JWT
  const getUser = () => {
    if (!token) return { name: "Patient", role: "PATIENT" };

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return {
        name: payload.name || payload.fullName || "Patient",
        role: payload.role || "PATIENT",
      };
    } catch {
      return { name: "Patient", role: "PATIENT" };
    }
  };

  const user = getUser();
  const initial = user.name.charAt(0).toUpperCase();

  // 🔥 Close dropdown outside click
  useEffect(() => {
    const handler = (e: any) => {
      if (!profileRef.current?.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const navItem = (to: string, label: string) => {
    const active = location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`block py-2 px-3 rounded transition ${
          active
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-white/10"
        }`}
      >
        {label}
      </Link>
    );
  };

  const sidebar = (
    <div className="flex flex-col h-full justify-between text-white">

      <div>
        <h2 className="text-2xl font-bold mb-8">
          🏥 HMS Patient
        </h2>

        <nav className="space-y-2 text-sm">
          {navItem("/patient/dashboard", "📊 Dashboard")}
          {navItem("/patient/doctors", "🩺 Find Doctors")}
          {navItem("/patient/appointments", "📅 My Appointments")}
          {navItem("/patient/prescriptions", "📄 Prescriptions")}
          {navItem("/patient/ehr", "🧾 Health Records")}
        </nav>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="w-full py-2 bg-red-500 hover:bg-red-600 rounded text-white transition"
      >
        Logout
      </button>

    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 p-5">
        {sidebar}
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar open={open} onClose={() => setOpen(false)}>
        <div className="bg-slate-900 h-full p-5">
          {sidebar}
        </div>
      </MobileSidebar>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <button className="md:hidden p-2" onClick={() => setOpen(true)}>
              <Menu className="text-gray-700 dark:text-gray-200" />
            </button>

            <div className="text-lg font-semibold text-gray-800 dark:text-white">
              Patient Panel
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* Dark Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <NotificationPanel />

            {/* 🔥 Avatar */}
            <div ref={profileRef} className="relative">

              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 cursor-pointer rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
              >
                {initial}
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-lg rounded-lg border z-50">

                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {user.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {user.role}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/patient/profile");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 text-gray-900 dark:text-gray-100">
          {children}
        </main>

      </div>
    </div>
  );
}