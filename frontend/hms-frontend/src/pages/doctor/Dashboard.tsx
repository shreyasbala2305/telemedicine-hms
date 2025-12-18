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

  const upcoming = appointments.filter(a => new Date(a.appointmentDate) > new Date());
  const today = appointments.filter(a => {
    const d = new Date(a.appointmentDate);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <DoctorLayout>
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Today's Appointments</p>
          <p className="text-2xl font-bold">{today.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold">{upcoming.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{appointments.length}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Next Appointments</h2>
        {loading ? <div>Loading...</div> : (
          appointments.slice(0, 6).map(a => (
            <div key={a.id} className="py-2 border-b last:border-b-0">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Patient ID: {a.patientId}</div>
                  <div className="text-sm text-gray-500">{new Date(a.appointmentDate).toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-600">{a.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </DoctorLayout>
  );
}
