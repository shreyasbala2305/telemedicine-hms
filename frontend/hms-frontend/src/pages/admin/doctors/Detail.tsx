import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getDoctor } from "../../../services/doctorService";
import { getAppointmentsByDoctor } from "../../../services/appointmentService";

export default function DoctorDetail() {
  const { id } = useParams<{ id: string }>();

  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const d = await getDoctor(Number(id));
        setDoctor(d);

        const appts = await getAppointmentsByDoctor(Number(id));
        setAppointments(appts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  if (!doctor)
    return <DashboardLayout><div>Doctor not found</div></DashboardLayout>;

  const totalPatients = new Set(appointments.map(a => a.patientId)).size;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{doctor.name}</h1>
            <p className="text-gray-500">{doctor.speciality}</p>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/admin/doctors/${doctor.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </Link>

            <Link
              to={`/admin/doctors/${doctor.id}/availability`}
              className="px-4 py-2 border rounded"
            >
              Availability
            </Link>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow grid md:grid-cols-2 gap-4">
          <div>
            <div><strong>Email:</strong> {doctor.email}</div>
            <div><strong>Contact:</strong> {doctor.contact}</div>
          </div>

          <div>
            <div><strong>Qualification:</strong> {doctor.qualification}</div>
            <div><strong>Speciality:</strong> {doctor.speciality}</div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="text-2xl font-bold">{appointments.length}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Patients Treated</p>
            <p className="text-2xl font-bold">{totalPatients}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </div>
        </div>

        {/* RECENT APPOINTMENTS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Recent Appointments</h2>

          {appointments.length === 0 ? (
            <div className="text-gray-500 text-sm">
              No appointments yet
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map(a => (
                <div
                  key={a.id}
                  className="flex justify-between border-b pb-2"
                >
                  <div>
                    <div className="font-medium">
                      Patient #{a.patientId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(a.dateTime).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-sm">
                    {a.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}