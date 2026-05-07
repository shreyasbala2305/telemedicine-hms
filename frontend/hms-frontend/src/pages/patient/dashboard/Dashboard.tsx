// src/pages/patient/dashboard/Dashboard.tsx

import React, { useEffect, useState } from "react";
import { getAppointments, getAppointmentsByPatient } from "../../../services/appointmentService";
import { useAuth } from "../../../context/AuthContext";
import PatientLayout from "../../../layouts/PatientLayout";
import { getPatientByUserId } from "../../../services/patientService";

export default function PatientDashboard() {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 patient first name
  const [patientName, setPatientName] = useState("Patient");

  // 🔥 extract user info from JWT
  const getUserFromToken = () => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      console.log("JWT Payload:", payload);

      return {
        userId: payload.userId || payload.id || payload.sub || null,
        name: payload.name || payload.fullName || "Patient",
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const user = getUserFromToken();

        if (!user?.userId) {
          setAppointments([]);
          setLoading(false);
          return;
        }

        // 🔥 first name only
        const firstName = user.name.split(" ")[0];
        setPatientName(firstName);

        // 🔥 fetch appointments
        const patient = await getPatientByUserId(user.userId);

        const mine = await getAppointmentsByPatient(patient.id);
        console.log("Appointments:", mine);
        setAppointments(mine);

      } catch (err) {
        console.error("Failed to load appointments", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // 🔥 derived data
  const upcoming = appointments.filter(
    (a) => new Date(a.dateTime) > new Date()
  );

  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  );

  return (
    <PatientLayout>

      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Hello, {patientName} 👋
          </h1>

          <p className="text-gray-500 text-sm">
            Overview of your health activity
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
            <p className="text-sm text-gray-500">
              Total Appointments
            </p>

            <p className="text-2xl font-bold">
              {appointments.length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
            <p className="text-sm text-gray-500">
              Upcoming
            </p>

            <p className="text-2xl font-bold">
              {upcoming.length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <p className="text-2xl font-bold">
              {completed.length}
            </p>
          </div>

        </div>

        {/* UPCOMING APPOINTMENTS */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow">

          <h2 className="font-semibold mb-4">
            Upcoming Appointments
          </h2>

          {loading ? (

            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>

          ) : upcoming.length === 0 ? (

            <div className="text-gray-500">
              No upcoming appointments
            </div>

          ) : (

            <div className="space-y-3">

              {upcoming.slice(0, 5).map((a) => (

                <div
                  key={a.id}
                  className="border rounded-xl p-4 flex justify-between items-center"
                >

                  <div>

                    <div className="font-medium">
                      {new Date(a.dateTime).toLocaleString()}
                    </div>

                    <div className="text-sm text-gray-500">
                      Doctor #{a.doctorId}
                    </div>

                  </div>

                  <div className="text-sm font-medium text-blue-600">
                    {a.status}
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </PatientLayout>
  );
}