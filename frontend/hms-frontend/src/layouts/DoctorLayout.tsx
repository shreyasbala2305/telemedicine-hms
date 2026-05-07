import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationPanel from "../components/widgets/NotificationPanel";
import MobileSidebar from "../components/ui/MobileSidebar";
import { Menu, Moon, Sun, LogOut } from "lucide-react";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { logout, token } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // 🔥 Extract user from JWT
  const getUser = () => {
    if (!token) return { name: "Doctor", role: "DOCTOR" };
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        name: payload.name || payload.fullName || "Doctor",
        role: payload.role || "DOCTOR",
      };
    } catch {
      return { name: "Doctor", role: "DOCTOR" };
    }
  };

  const user = getUser();
  const initial = user.name.charAt(0).toUpperCase();

  // 🔥 close dropdown on outside click
  useEffect(() => {
    const handler = (e: any) => {
      if (!profileRef.current?.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItem = (to: string, label: string) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`block py-2 px-3 rounded ${
          active
            ? "bg-blue-600 text-white"
            : "hover:bg-white/10 text-gray-300"
        }`}
      >
        {label}
      </Link>
    );
  };

  // ❌ Removed Profile from sidebar
  const sidebar = (
    <div className="flex flex-col h-full justify-between text-white">
      <div>
        <h2 className="text-2xl font-bold mb-8">🏥 HMS Doctor</h2>

        <nav className="space-y-2 text-sm">
          {navItem("/doctor/dashboard", "📊 Dashboard")}
          {navItem("/doctor/appointments", "📅 Appointments")}
          {navItem("/doctor/patients", "👥 Patients")}
        </nav>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-xl"
      >
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 p-5">
        {sidebar}
      </aside>

      <MobileSidebar open={open} onClose={() => setOpen(false)}>
        <div className="bg-slate-900 h-full p-5">{sidebar}</div>
      </MobileSidebar>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b">

          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setOpen(true)}>
              <Menu />
            </button>
            <div className="text-lg font-semibold">
              Doctor Panel
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Dark Mode */}
            <button
              onClick={toggle}
              className="p-2 border rounded"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <NotificationPanel />

            {/* 🔥 AVATAR */}
            <div ref={profileRef} className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 cursor-pointer rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
              >
                {initial}
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-lg rounded-lg border z-50">

                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/doctor/profile");
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

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}