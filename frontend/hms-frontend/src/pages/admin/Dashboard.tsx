import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getAppointmentsPaged } from "../../services/appointmentService";
import { getPatients } from "../../services/patientService";
import DataTable from "../../components/ui/DataTable";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const ap = await getAppointmentsPaged({
        page: 1,
        pageSize: 1000,
      });
      setAppointments(ap.content || []);
      setTotalAppointments(ap.totalElements || 0);

      const ps = await getPatients();
      setPatients(ps || []);
      setLoading(false);
    })();
  }, []);

  // 📊 Monthly aggregation
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthMap: Record<string, number> = {};
  months.forEach(m => (monthMap[m] = 0));

  appointments.forEach(a => {
    try {
      const d = new Date(a.dateTime); // ✅ FIXED
      monthMap[months[d.getMonth()]]++;
    } catch {}
  });

  const chartData = months.map(m => ({ month: m, count: monthMap[m] }));

  // 📋 Table columns
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Overview of your hospital system
            </p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
            {new Date().toDateString()}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
            <div className="text-sm opacity-80">Total Patients</div>
            <div className="text-3xl font-bold">{patients.length}</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg">
            <div className="text-sm opacity-80">Appointments</div>
            <div className="text-3xl font-bold">{totalAppointments}</div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
            <div className="text-sm opacity-80">Today's Appointment</div>
            <div className="text-3xl font-bold">
              {
                appointments.filter(a =>
                  new Date(a.dateTime).toDateString() === new Date().toDateString()
                ).length
              }
            </div>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHART */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                Monthly Appointments
              </h2>
              <span className="text-xs text-gray-400">
                Last 12 months
              </span>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#3B82F6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RECENT PATIENTS */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 transition-colors">
            <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
              Recent Patients
            </h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto">

              {patients.slice(0, 6).map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {p.email}
                    </div>
                  </div>

                  {/* <div className="text-xs text-gray-400">
                    #{p.id}
                  </div> */}
                </div>
              ))}

              {patients.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No patients yet
                </div>
              )}

            </div>
          </div>

        </div>

        {/* FULL TABLE */}
        {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 transition-colors">
          <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            All Patients
          </h2>

          <DataTable columns={columns} data={patients} loading={loading} />
        </div> */}

      </div>
    </DashboardLayout>
  );
}