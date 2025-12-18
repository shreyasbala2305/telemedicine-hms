import React, { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getAppointmentsByDoctor, updateAppointment } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/ui/StatusBadge";

export default function DoctorAppointments() {
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

  const load = async () => {
    setLoading(true);
    const docId = getDoctorIdFromToken();
    if (!docId) { setAppointments([]); setLoading(false); return; }
    const data = await getAppointmentsByDoctor(docId);
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const changeStatus = async (id: number, status: string) => {
    await updateAppointment(id, { status });
    load();
  };

  return (
    <DoctorLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr> :
            appointments.length === 0 ? <tr><td colSpan={5} className="p-6 text-center">No appointments</td></tr> :
            appointments.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.id}</td>
                <td className="p-3">#{a.patientId}</td>
                <td className="p-3">{new Date(a.appointmentDate).toLocaleString()}</td>
                <td className="p-3"><StatusBadge status={a.status} /></td>
                <td className="p-3">
                  <button onClick={() => changeStatus(a.id, 'COMPLETED')} className="mr-2 text-green-600">Complete</button>
                  <button onClick={() => changeStatus(a.id, 'CANCELLED')} className="text-red-600">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DoctorLayout>
  );
}
