import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationPanel from "../components/widgets/NotificationPanel";
import MobileSidebar from "../components/ui/MobileSidebar";
import {
  Menu,
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, token } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // 🔥 Extract user from JWT
  const getUser = () => {
    if (!token) return { name: "A", role: "Admin" };
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        name: payload.name || payload.fullName || "A",
        role: payload.role || "Admin",
      };
    } catch {
      return { name: "A", role: "Admin" };
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

  const navItem = (to: string, label: string, icon: any) => {
    const active = location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
          active
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-white/10"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  const sidebar = (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">🏥 HMS</h2>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        <nav className="space-y-2 text-sm">
          {navItem("/admin", "Dashboard", <LayoutDashboard size={18} />)}
          {navItem("/admin/patients", "Patients", <Users size={18} />)}
          {navItem("/admin/doctors", "Doctors", <Stethoscope size={18} />)}
          {navItem("/admin/appointments", "Appointments", <Calendar size={18} />)}
          {navItem("/admin/receptionists", "Receptionists", <Users size={18} />)}
        </nav>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white p-5">
        {sidebar}
      </aside>

      <MobileSidebar open={open} onClose={() => setOpen(false)}>
        <div className="bg-slate-900 h-full p-5 text-white">
          {sidebar}
        </div>
      </MobileSidebar>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setOpen(true)}>
              <Menu />
            </button>

            <h1 className="text-lg font-semibold">
              Admin Dashboard
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* Dark Mode */}
            <button
              onClick={toggle}
              className="p-2 border rounded"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <NotificationPanel />

            {/* PROFILE */}
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
                      navigate("/admin/profile");
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