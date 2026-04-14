import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationPanel from "../components/widgets/NotificationPanel";
import MobileSidebar from "../components/ui/MobileSidebar";
import { Menu, Moon, Sun } from "lucide-react";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItem = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`block py-2 px-3 rounded transition ${
          active
            ? "bg-blue-600 text-white"
            : "hover:bg-white/10 text-gray-300"
        }`}
      >
        {label}
      </Link>
    );
  };

  // inside sidebar
  const sidebar = (
    <div className="flex flex-col h-full justify-between text-white">
      
      <div>
        <h2 className="text-2xl font-bold mb-8 tracking-wide">
          🏥 HMS Doctor
        </h2>

        <nav className="space-y-2 text-sm">

          {navItem("/doctor/dashboard", "📊 Dashboard")}
          {navItem("/doctor/appointments", "📅 Appointments")}
          {navItem("/doctor/patients", "👥 Patients")}
          {navItem("/doctor/profile", "👤 Profile")}

        </nav>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white transition font-medium"
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

      <MobileSidebar open={open} onClose={() => setOpen(false)}>
        <div className="bg-slate-900 h-full p-5">{sidebar}</div>
      </MobileSidebar>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setOpen(true)}>
              <Menu className="text-gray-700 dark:text-gray-200" />
            </button>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">
              Doctor Panel
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Dark Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <NotificationPanel />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 text-gray-900 dark:text-gray-100 transition-colors">
          {children}
        </main>

      </div>
    </div>
  );
}