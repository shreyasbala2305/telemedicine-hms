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
      setLoading(true);
      const userId = getUserIdFromToken();
      if (!userId) { setAppointments([]); setLoading(false); return; }
      const all = await getAppointments();
      const mine = all.filter((a: { patientId: any; }) => String(a.patientId) === String(userId));
      setAppointments(mine);
      setLoading(false);
    })();
  }, [token]);

  return (
    <PatientLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-2">Your Upcoming Appointments</h2>
        {loading ? <div>Loading...</div> : (appointments.length === 0 ? <div>No upcoming appointments</div> : appointments.map(a => (
          <div key={a.id} className="py-2 border-b">
            <div>{new Date(a.appointmentDate).toLocaleString()} — Doctor #{a.doctorId} — <span className="font-semibold">{a.status}</span></div>
          </div>
        )))}
      </div>
    </PatientLayout>
  );
}
