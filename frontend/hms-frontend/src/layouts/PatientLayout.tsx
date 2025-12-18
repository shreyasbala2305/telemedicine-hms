// src/layouts/PatientLayout.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationPanel from "../components/widgets/NotificationPanel";
import MobileSidebar from "../components/ui/MobileSideBar";
import { Menu } from "lucide-react";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <>
      <h2 className="text-xl font-semibold mb-6 text-primary">HMS — Patient</h2>
      <nav className="space-y-2 text-sm">
        <Link to="/patient/dashboard" className="block py-2 px-3 rounded hover:bg-gray-100">Dashboard</Link>
        <Link to="/patient/appointments" className="block py-2 px-3 rounded hover:bg-gray-100">My Appointments</Link>
        <Link to="/patient/profile" className="block py-2 px-3 rounded hover:bg-gray-100">Profile</Link>
      </nav>
      <div className="mt-6">
        <button onClick={() => { logout(); navigate("/login"); }} className="w-full py-2 bg-red-600 text-white rounded">Logout</button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden md:block w-64 bg-white text-gray-800 p-5 flex flex-col justify-between shadow">{sidebar}</aside>
      <MobileSidebar open={open} onClose={() => setOpen(false)}>{sidebar}</MobileSidebar>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setOpen(true)}><Menu /></button>
            <div className="text-lg font-semibold text-primary">Patient Panel</div>
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
