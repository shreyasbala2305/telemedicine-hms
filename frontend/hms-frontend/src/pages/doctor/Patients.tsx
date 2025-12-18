import React, { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getAppointmentsByDoctor } from "../../services/appointmentService";
import { getPatientsByIds } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function DoctorPatients() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getDoctorIdFromToken = () => {
    if (!token) return null;
    try { const payload = JSON.parse(atob(token.split(".")[1])); return payload.sub || payload.id || payload.doctorId || null; } catch { return null; }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const docId = getDoctorIdFromToken();
      if (!docId) { setPatients([]); setLoading(false); return; }
      const appointments = await getAppointmentsByDoctor(docId);
      const uniquePatientIds = Array.from(new Set(appointments.map((a: any) => String(a.patientId))));
      const pats = await getPatientsByIds(uniquePatientIds);
      setPatients(pats);
      setLoading(false);
    })();
  }, [token]);

  return (
    <DoctorLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Patients</h1>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr> :
            patients.length === 0 ? <tr><td colSpan={5} className="p-6 text-center">No patients</td></tr> :
            patients.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.contact}</td>
                <td className="p-3">
                  <Link to={`/doctor/patients/${p.id}`} className="text-blue-600">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DoctorLayout>
  );
}
