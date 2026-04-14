import React, { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { getAppointments } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

export default function PatientDashboard() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserIdFromToken = () => {
    if (!token) return null;
    try { const payload = JSON.parse(atob(token.split(".")[1])); return payload.sub || payload.userId || payload.id || null; } catch { return null; }
  };

  useEffect(() => {
    (async () => {
      try{
        setLoading(true);
        const userId = getUserIdFromToken();
        if (!userId) { setAppointments([]); setLoading(false); return; }
        const all = await getAppointments();
        const mine = all.filter((a: { patientId: any; }) => String(a.patientId) === String(userId));
        setAppointments(mine);
      }catch(err){
        console.error("Failed to load appointment",err);
        setAppointments([]);
      }finally{
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <PatientLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Welcome 👋</h1>
          <p className="text-gray-500 text-sm">
            Overview of your health activity
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="text-2xl font-bold">{appointments.length}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="text-2xl font-bold">
              {appointments.filter(a => new Date(a.dateTime) > new Date()).length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">
              {appointments.filter(a => a.status === "COMPLETED").length}
            </p>
          </div>
        </div>

        {/* UPCOMING LIST */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Upcoming Appointments</h2>

          {loading ? (
            <div className="animate-pulse h-20 bg-gray-200 rounded" />
          ) : appointments.length === 0 ? (
            <div className="text-gray-500">No appointments</div>
          ) : (
            appointments.slice(0, 5).map(a => (
              <div key={a.id} className="py-2 border-b last:border-b-0">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">
                      {new Date(a.dateTime).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Doctor #{a.doctorId}
                    </div>
                  </div>
                  <div className="text-sm">{a.status}</div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </PatientLayout>
  );
}
