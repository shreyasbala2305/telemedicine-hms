import React, { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { getAppointmentsByPatient, updateAppointment} from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { getPatientByUserId } from "../../services/patientService";

export default function PatientAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserIdFromToken = () => {
    if (!token) return null;
    try { const payload = JSON.parse(atob(token.split(".")[1])); return payload.userId || payload.id || null; } catch { return null; }
  };

  const cancelAppointment = async (id: number) => {
    try {
      await updateAppointment(id, { status: "CANCELLED" });
      toast.success("Appointment cancelled");
      setAppointments(prev => prev.map(a =>
        a.id === id ? { ...a, status: "CANCELLED" } : a
      ));
    } catch {
      toast.error("Failed to cancel");
    }
  };

  useEffect(() => {

    (async () => {

      try {

        setLoading(true);

        const userId = getUserIdFromToken();

        if (!userId) {

          setAppointments([]);

          return;
        }

        // 🔥 fetch current patient
        const patient =
          await getPatientByUserId(userId);

        console.log("PATIENT:", patient);

        if (!patient?.id) {

          setAppointments([]);

          return;
        }

        // 🔥 fetch appointments
        const data =
          await getAppointmentsByPatient(
            patient.id
          );

        console.log(
          "PATIENT APPOINTMENTS:",
          data
        );

        // 🔥 latest first
        const sorted =
          (data || []).sort(
            (a: any, b: any) =>
              new Date(b.dateTime).getTime() -
              new Date(a.dateTime).getTime()
          );

        setAppointments(sorted);

      } catch (err) {

        console.error(
          "FAILED TO LOAD APPOINTMENTS",
          err
        );

        setAppointments([]);

      } finally {

        setLoading(false);

      }

    })();

  }, [token]);

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-gray-500 text-sm">
            View and manage your bookings
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow animate-pulse h-20" />
              ))}
            </div>
          ) : appointments.length === 0 ? (

            /* EMPTY STATE */
            <div className="bg-white p-10 rounded-2xl shadow text-center">
              <div className="text-lg font-medium text-gray-700">
                No appointments yet
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Book your first appointment to get started
              </p>
            </div>

          ) : (

            appointments.map(a => (
              <div
                key={a.id}
                className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition flex items-center justify-between"
              >

                {/* LEFT */}
                <div>
                  <div className="font-semibold text-gray-800">
                    {new Date(a.dateTime).toLocaleString()}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    Doctor ID: #{a.doctorId}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      a.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"

                        : a.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"

                        : a.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"

                        : a.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"

                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {a.status}
                  </span>

                  <button
                    disabled={
                      a.status === "CANCELLED" || a.status === "COMPLETED"
                    }
                    onClick={() => cancelAppointment(a.id)}
                    className="ml-3 px-3 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            ))

          )}

        </div>

      </div>
    </PatientLayout>
  );
}
