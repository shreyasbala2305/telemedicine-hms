import { useEffect, useState } from "react";
import DoctorLayout from "../../../layouts/DoctorLayout";
import { getAppointmentsByDoctor } from "../../../services/appointmentService";
import { getPatientsByIds } from "../../../services/patientService";
import { useAuth } from "../../../context/AuthContext";
import { getDoctor, getDoctorByUserId } from "../../../services/doctorService";

export default function DoctorDashboard() {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [patientMap, setPatientMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("Doctor");

  // 🔥 Extract doctor info
  const getDoctorFromToken = () => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return {
        id: payload.id || payload.sub || payload.doctorId,
        name: payload.name || payload.fullName || "Doctor"
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId || payload.sub;

        console.log("JWT payload:", payload);
        console.log("UserId:", userId);

        const doctor = await getDoctorByUserId(userId);
        console.log("Doctor API response:", doctor);

        if (!doctor?.id) {
          setAppointments([]);
          return;
        }

        setDoctorName(doctor.name);

        // 🔥 STEP 2 — GET APPOINTMENTS
        const data = await getAppointmentsByDoctor(doctor.id);
        let list = data?.content || data || [];

        setAppointments(list);

        // 🔥 STEP 3 — GET PATIENTS
        const patientIds = [...new Set(list.map((a: any) => a.patientId))] as (number | string)[];

        if (patientIds.length > 0) {
          const patients = await getPatientsByIds(patientIds);

          const map: Record<number, string> = {};
          patients.forEach((p: any) => {
            map[p.id] = p.name;
          });

          setPatientMap(map);
        }

      } catch (err) {
        console.error("Doctor dashboard error:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // 🔥 derived data
  const upcoming = appointments.filter(a => {
    if (!a.dateTime) return false;
    return new Date(a.dateTime) > new Date();
  });

  const today = appointments.filter(a => {
    if (!a.dateTime) return false;

    const d = new Date(a.dateTime);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <DoctorLayout>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Welcome Doctor - {doctorName} 👨‍⚕️
        </h1>
        <p className="text-gray-500 text-sm">
          Here's your overview for today
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Today's Appointments</p>
          <p className="text-3xl font-bold mt-2">{today.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-3xl font-bold mt-2">{upcoming.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
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
        ) : upcoming.length === 0 ? (
          <div className="text-center text-gray-500">
            No upcoming appointments
          </div>
        ) : (
          upcoming.slice(0, 6).map(a => (
            <div key={a.id} className="flex justify-between py-3 border-b last:border-0">

              <div>
                <div className="font-medium">
                  {patientMap[a.patientId] || `Patient #${a.patientId}`}
                </div>

                <div className="text-sm text-gray-500">
                  {a.dateTime
                    ? new Date(a.dateTime).toLocaleString()
                    : "No time assigned"}
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