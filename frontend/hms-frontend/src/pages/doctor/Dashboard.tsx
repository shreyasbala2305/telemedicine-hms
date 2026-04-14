import React, { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getAppointmentsByDoctor } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

export default function DoctorDashboard() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getDoctorIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.id || payload.doctorId || null;
    } catch { return null; }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const docId = getDoctorIdFromToken();
      if (!docId) { setLoading(false); return; }
      const data = await getAppointmentsByDoctor(docId);
      setAppointments(data);
      setLoading(false);
    })();
  }, [token]);

  const upcoming = appointments.filter(a => new Date(a.dateTime) > new Date());
  const today = appointments.filter(a => {
    const d = new Date(a.dateTime);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <DoctorLayout>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome Doctor 👨‍⚕️</h1>
        <p className="text-gray-500 text-sm">
          Here's your overview for today
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Today's Appointments</p>
          <p className="text-3xl font-bold mt-2">{today.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-3xl font-bold mt-2">{upcoming.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-3xl font-bold mt-2">{appointments.length}</p>
        </div>

      </div>

      {/* APPOINTMENTS LIST */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h2 className="font-semibold text-lg mb-4">Upcoming Appointments</h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-gray-500">
            No appointments available
          </div>
        ) : (
          appointments.slice(0, 6).map(a => (
            <div key={a.id} className="flex justify-between py-3 border-b last:border-0">

              <div>
                <div className="font-medium">
                  Patient #{a.patientId}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(a.dateTime).toLocaleString()}
                </div>
              </div>

              <div className="text-sm font-medium text-blue-600">
                {a.status}
              </div>

            </div>
          ))
        )}
      </div>

    </DoctorLayout>
  );
}
