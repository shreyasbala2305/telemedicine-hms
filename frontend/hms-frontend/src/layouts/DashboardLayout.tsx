import React, { useState } from "react";
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
  const { logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItem = (to: string, label: string, icon: any) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
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
        {/* Logo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">🏥 HMS</h2>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="space-y-2 text-sm">
          {navItem("/admin", "Dashboard", <LayoutDashboard size={18} />)}
          {navItem("/admin/patients", "Patients", <Users size={18} />)}
          {navItem("/admin/doctors", "Doctors", <Stethoscope size={18} />)}
          {navItem("/admin/appointments", "Appointments", <Calendar size={18} />)}
        </nav>
      </div>

      {/* Logout */}
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">

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
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setOpen(true)}>
              <Menu className="text-gray-700 dark:text-gray-200" />
            </button>

            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <NotificationPanel />

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
              A
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-6 text-gray-900 dark:text-gray-100 transition-colors">
          {children}
        </main>

      </div>
    </div>
  );
}