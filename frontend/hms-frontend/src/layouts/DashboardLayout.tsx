// src/layouts/DashboardLayout.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationPanel from "../components/widgets/NotificationPanel";
import MobileSidebar from "../components/ui/MobileSideBar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <>
      <h2 className="text-2xl font-bold mb-6">HMS</h2>
      <nav className="space-y-3 text-sm">
        <Link to="/admin" className="block py-2 px-3 rounded hover:bg-white/5">Dashboard</Link>
        <Link to="/admin/patients" className="block py-2 px-3 rounded hover:bg-white/5">Patients</Link>
        <Link to="/admin/doctors" className="block py-2 px-3 rounded hover:bg-white/5">Doctors</Link>
        <Link to="/admin/appointments" className="block py-2 px-3 rounded hover:bg-white/5">Appointments</Link>
        <Link to="/admin/logs" className="block py-2 px-3 rounded hover:bg-white/5">Activity Logs</Link>
      </nav>
      <div className="mt-6">
        <button onClick={() => { logout(); navigate("/login"); }} className="w-full py-2 bg-red-600 rounded">Logout</button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-72 bg-sidebar text-white p-6 flex flex-col justify-between">
        {sidebar}
      </aside>

      {/* Mobile sidebar drawer */}
      <MobileSidebar open={open} onClose={() => setOpen(false)}>
        <div className="h-full flex flex-col justify-between">
          {sidebar}
        </div>
      </MobileSidebar>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow sm:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setOpen(true)}><Menu /></button>
            <div className="text-lg font-semibold">Admin Panel</div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationPanel />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
