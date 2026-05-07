import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import MobileSidebar from "../components/ui/MobileSidebar";
import {
  Menu,
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Sun,
  Moon
} from "lucide-react";

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // 🔥 FIXED ACTIVE LOGIC
  const isActive = (path: string) => {
    if (path === "/receptionist") {
      return location.pathname === "/receptionist";
    }
    return location.pathname.startsWith(path);
  };

  const navItem = (to: string, label: string, icon: any) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
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
          <p className="text-xs text-gray-400">Reception Desk</p>
        </div>

        <nav className="space-y-2 text-sm">
          {navItem("/receptionist", "Dashboard", <LayoutDashboard size={18} />)}
          {navItem("/receptionist/patients", "Patients", <Users size={18} />)}
          {navItem("/receptionist/appointments", "Appointments", <Calendar size={18} />)}
          {navItem("/receptionist/queue", "Today Queue", <Calendar size={18} />)}
        </nav>

      </div>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white p-5">
        {sidebar}
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar open={open} onClose={() => setOpen(false)}>
        <div className="bg-slate-900 h-full p-5 text-white">
          {sidebar}
        </div>
      </MobileSidebar>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 border-b">

          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="md:hidden">
              <Menu />
            </button>
            <h1 className="font-semibold">Receptionist Panel</h1>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggle}
            className="
              p-2 rounded-lg 
              border 
              border-gray-200 dark:border-gray-600
              bg-white dark:bg-gray-800 
              hover:bg-gray-100 dark:hover:bg-gray-600
              transition
            "
          >
            {dark ? (
              <Sun size={20} className="text-yellow-400" />   // ☀️ visible in dark
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>

        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-6 text-gray-900 dark:text-gray-100 transition-colors">
          {children}
        </main>

      </div>
    </div>
  );
}