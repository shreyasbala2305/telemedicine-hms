import React, { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { getAppointments } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

export default function PatientAppointments() {
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
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      <div className="bg-white rounded-2xl shadow p-4">
        {loading ? <div>Loading...</div> : (appointments.length === 0 ? <div>No appointments</div> : appointments.map(a => (
          <div key={a.id} className="py-2 border-b">
            <div>{new Date(a.appointmentDate).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Status: {a.status}</div>
          </div>
        )))}
      </div>
    </PatientLayout>
  );
}
