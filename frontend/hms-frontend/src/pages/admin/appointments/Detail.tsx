import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getAppointment } from "../../../services/appointmentService";
import { getPatient } from "../../../services/patientService";
import { getDoctor } from "../../../services/doctorService";

export default function AdminAppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const appt = await getAppointment(Number(id));
        setAppointment(appt);

        // 🔥 fetch related data
        if (appt?.patientId) {
          const p = await getPatient(appt.patientId);
          setPatient(p);
        }

        if (appt?.doctorId) {
          const d = await getDoctor(appt.doctorId);
          setDoctor(d);
        }

      } catch (err) {
        console.error("Appointment detail error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!appointment) {
    return (
      <DashboardLayout>
        <div className="p-6">Appointment not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Appointment #{appointment.id}</h1>

          <button
            onClick={() => navigate("/admin/appointments")}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">Patient</p>
              <p className="font-semibold">
                {patient?.name || `Patient #${appointment.patientId}`}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="font-semibold">
                {doctor?.name || `Doctor #${appointment.doctorId}`}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-semibold">
                {appointment.dateTime
                  ? new Date(appointment.dateTime).toLocaleString()
                  : "Not assigned"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-blue-600">
                {appointment.status}
              </p>
            </div>

          </div>

          {/* DESCRIPTION */}
          {appointment.description && (
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="mt-1">{appointment.description}</p>
            </div>
          )}

        </div>

        {/* OPTIONAL STATS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Appointment ID</p>
            <p className="text-xl font-bold">{appointment.id}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Doctor ID</p>
            <p className="text-xl font-bold">{appointment.doctorId}</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}