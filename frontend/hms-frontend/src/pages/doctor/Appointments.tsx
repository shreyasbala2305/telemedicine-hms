import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getAppointmentsByDoctor, updateAppointment } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/ui/StatusBadge";
import { Link } from "react-router-dom";

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
    try {
      setLoading(true);
      const docId = getDoctorIdFromToken();

      if (!docId) {
        setAppointments([]);
        return;
      }

      const data = await getAppointmentsByDoctor(docId);
      setAppointments(data || []);
    } catch (err) {
      console.error("Failed to load doctor appointments", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const changeStatus = async (id: number, status: string) => {
  try {
    await updateAppointment(id, { status });
    toast.success(`Marked as ${status}`);
    load();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update status");
  }
};

  return (
    <DoctorLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-gray-500 text-sm">
            Manage and update patient appointments
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow animate-pulse h-24" />
              ))}
            </div>
          ) : appointments.length === 0 ? (

            /* EMPTY STATE */
            <div className="bg-white p-10 rounded-2xl shadow text-center">
              <div className="text-lg font-medium text-gray-700">
                No appointments assigned
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Your upcoming appointments will appear here
              </p>
            </div>

          ) : (

            appointments.map(a => (
              <div
                key={a.id}
                className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >

                {/* LEFT */}
                <div>
                  <div className="font-semibold text-gray-800">
                    {new Date(a.dateTime).toLocaleString()}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    Patient ID: #{a.patientId}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  {/* STATUS */}
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      a.status === "CONFIRMED"
                        ? "bg-green-100 text-green-600"
                        : a.status === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : a.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {a.status}
                  </span>

                  {/* ACTIONS */}
                  <button
                    disabled={a.status === "COMPLETED"}
                    onClick={() => changeStatus(a.id, "COMPLETED")}
                    className="px-3 py-1 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-40"
                  >
                    Complete
                  </button>

                  <button
                    disabled={a.status === "CANCELLED"}
                    onClick={() => changeStatus(a.id, "CANCELLED")}
                    className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <Link
                    to={`/doctor/prescriptions/new?appointment=${a.id}`}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                  >
                    Add Prescription
                  </Link>
                </div>

              </div>
            ))

          )}

        </div>

      </div>
      
    </DoctorLayout>
  );
}
