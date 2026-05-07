import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import DoctorLayout from "../../../layouts/DoctorLayout";
import { getAppointmentsByDoctor } from "../../../services/appointmentService";
import { getPatientsByIds } from "../../../services/patientService";
import { getDoctorByUserId } from "../../../services/doctorService";

export default function DoctorPatients() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.id;

        // 🔥 GET DOCTOR
        const doctor = await getDoctorByUserId(userId);

        if (!doctor?.id) {
          setPatients([]);
          return;
        }

        // 🔥 GET APPOINTMENTS
        const res = await getAppointmentsByDoctor(doctor.id);
        const appointments = res?.content || res || [];

        // 🔥 UNIQUE PATIENT IDS
        const ids = [...new Set(appointments.map((a: any) => a.patientId))] as (number | string)[];

        if (ids.length === 0) {
          setPatients([]);
          return;
        }

        // 🔥 FETCH PATIENTS
        const pats = await getPatientsByIds(ids);

        setPatients(pats);

      } catch (err) {
        console.error("Doctor patients error:", err);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <DoctorLayout>
      <h1 className="text-2xl font-bold mb-4">My Patients</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td className="p-6">Loading...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td className="p-6">No Patients</td></tr>
            ) : (
              patients.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.contact}</td>
                  <td className="p-3">
                    <Link to={`/doctor/patients/${p.id}`} className="text-blue-600">
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