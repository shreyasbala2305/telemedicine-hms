import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatsCard from "../../components/ui/StatsCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getAppointments } from "../../services/appointmentService";
import { getPatients } from "../../services/PatientService";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const ap = await getAppointments();
      const ps = await getPatients();
      setAppointments(ap || []);
      setPatients(ps || []);
      setLoading(false);
    })();
  }, []);

  // build simple monthly aggregation for chart
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthMap: Record<string, number> = {};
  months.forEach(m => monthMap[m]=0);
  appointments.forEach(a => {
    try {
      const d = new Date(a.appointmentDate);
      monthMap[months[d.getMonth()]]++;
    } catch {}
  });
  const chartData = months.map(m => ({ month: m, count: monthMap[m] }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Overview</h1>
          <div className="text-sm text-gray-600">Welcome back — overview of system activity</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Total Patients" value={patients.length} subtitle="Registered patients" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z" fill="currentColor"/></svg>} />
          <StatsCard title="Appointments" value={appointments.length} subtitle="All time appointments" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 11h10" stroke="currentColor" strokeWidth="2"/></svg>} />
          <StatsCard title="Today" value={appointments.filter(a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()).length} subtitle="Appointments today" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8h18" stroke="currentColor" strokeWidth="2"/></svg>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Monthly appointments</h2>
              <div className="text-xs text-gray-500">Last 12 months</div>
            </div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">Recent patients</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {patients.slice(0,6).map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.email}</div>
                  </div>
                  <div className="text-xs text-gray-400">{p.id}</div>
                </div>
              ))}
              {patients.length===0 && <div className="text-sm text-gray-500">No patients yet</div>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
