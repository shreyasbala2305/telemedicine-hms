import React, { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getAppointment, updateAppointment } from "../../services/appointmentService";
import { useParams, useNavigate } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import toast from "react-hot-toast";

export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        setAppointment(await getAppointment(Number(id)));
        setLoading(false);
      })();
    }
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!appointment) return;
    await updateAppointment(appointment.id, { status });
    toast.success("Status updated");
    navigate("/doctor/appointments");
  };

  return (
    <DoctorLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Appointment Details</h1>
        {loading ? <div>Loading...</div> : appointment && (
          <div className="bg-white p-6 rounded-2xl shadow max-w-2xl">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <div className="text-lg font-medium">Patient ID: {appointment.patientId}</div>
                <div className="text-sm text-gray-500">{new Date(appointment.appointmentDate).toLocaleString()}</div>
              </div>
              <StatusBadge status={appointment.status} />
            </div>

            <div className="mb-4">
              <strong>Notes:</strong>
              <div className="mt-2">{appointment.description || '—'}</div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => updateStatus("COMPLETED")} className="bg-green-600 text-white px-4 py-2 rounded">Mark Completed</button>
              <button onClick={() => updateStatus("CANCELLED")} className="bg-red-600 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
