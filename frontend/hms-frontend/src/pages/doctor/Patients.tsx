import React, { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getAppointmentsByDoctor } from "../../services/appointmentService";
import { getPatientsByIds } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

/* ✅ Types */
type Appointment = {
  patientId: string | number;
};

type Patient = {
  id: string | number;
  name: string;
  email: string;
  contact: string;
};

export default function DoctorPatients() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const getDoctorIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.id || payload.doctorId || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const docId = getDoctorIdFromToken();
        if (!docId) {
          setPatients([]);
          return;
        }

        const appointments: Appointment[] = await getAppointmentsByDoctor(docId);

        console.log("Appointments:", appointments);

        if (!appointments || appointments.length === 0) {
          console.warn("No appointments found for doctor:", docId);
        }

        const uniquePatientIds = Array.from(
          new Set((appointments || []).map(a => a.patientId))
        );

        const pats: Patient[] = await getPatientsByIds(uniquePatientIds);

        setPatients(pats);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <DoctorLayout>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Patients</h1>
        <input
          placeholder="Search patient..."
          className="border px-3 py-2 rounded-lg"
        />
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
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  {Array(3).fill(0).map((_, j) => (
                    <td key={j} className="p-3">
                      <div className="h-3 w-full max-w-[150px] bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  No Patients
                </td>
              </tr>
            ) : (
              patients.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.contact}</td>
                  <td className="p-3">
                    <Link
                      to={`/doctor/patients/${p.id}`}
                      className="text-blue-600"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DoctorLayout>
  );
}