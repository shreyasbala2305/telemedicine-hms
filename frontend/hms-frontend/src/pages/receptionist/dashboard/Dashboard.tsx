import React, { useEffect, useState } from "react";
import { getAppointmentsPaged } from "../../../services/appointmentService";
import { useNavigate } from "react-router-dom";
import { getPatientsByIds } from "../../../services/patientService";
import { getDoctors } from "../../../services/doctorService";
import ReceptionistLayout from "../../../layouts/ReceptionistLayout";

export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [todayList, setTodayList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientMap, setPatientMap] = useState<Record<number, string>>({});
  const [doctorMap, setDoctorMap] = useState<Record<number, string>>({});

  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAppointmentsPaged({ page: 0, pageSize: 100 });
      const all = data.content || [];

      const patientIds = [...new Set(all.map((a: any) => a.patientId))] as (number | string)[];
      const doctorIds = [...new Set(all.map((a: any) => a.doctorId))] as (number | string)[];

      // 🔥 fetch patients
      const patients = await getPatientsByIds(patientIds);
      const pMap: any = {};
      patients.forEach((p: any) => (pMap[p.id] = p.name));
      setPatientMap(pMap);

      // 🔥 fetch doctors
      const doctors = await getDoctors();
      const dMap: any = {};
      doctors.forEach((d: any) => (dMap[d.id] = d.name));
      setDoctorMap(dMap);

      // 🔥 filter today
      const todayAppointments = all.filter((a: any) =>
        a.dateTime?.startsWith(today)
      );

      // 🔥 sort by time
      todayAppointments.sort(
        (a: any, b: any) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime()
      );

      setAppointments(all);
      setTodayList(todayAppointments);

      setLoading(false);
    })();
  }, []);

  // 🔥 STATS
  const pending = todayList.filter(a => a.status === "PENDING").length;
  const confirmed = todayList.filter(a => a.status === "CONFIRMED").length;
  const completed = todayList.filter(a => a.status === "COMPLETED").length;

  return (
    <ReceptionistLayout>

      <h1 className="text-2xl font-bold mb-6">Receptionist Dashboard</h1>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-xl font-bold">{todayList.length}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl">
          <p className="text-sm">Pending</p>
          <p className="text-xl font-bold">{pending}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <p className="text-sm">Confirmed</p>
          <p className="text-xl font-bold">{confirmed}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-xl">
          <p className="text-sm">Completed</p>
          <p className="text-xl font-bold">{completed}</p>
        </div>

      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate("/receptionist/appointments/new")}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + Book Appointment
        </button>

        <button
          onClick={() => navigate("/receptionist/patients/new")}
          className="border px-4 py-2 rounded"
        >
          + Add Patient
        </button>
      </div>

      {/* 🔥 TODAY QUEUE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow mb-6">

        <h2 className="font-semibold mb-4">Today's Queue</h2>

        {loading ? (
          <div>Loading...</div>
        ) : todayList.length === 0 ? (
          <div className="text-gray-500">No appointments today</div>
        ) : (
          <div className="space-y-3">

            {todayList.slice(0, 6).map(a => (
              <div
                key={a.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <div className="font-medium">
                    {patientMap[a.patientId] || `#${a.patientId}`}
                  </div>

                  <div className="text-sm text-gray-500">
                    Dr. {doctorMap[a.doctorId] || a.doctorId}
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(a.dateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div
                  className={`text-xs px-2 py-1 rounded ${
                    a.status === "PENDING"
                      ? "bg-yellow-200"
                      : a.status === "CONFIRMED"
                      ? "bg-green-200"
                      : "bg-blue-200"
                  }`}
                >
                  {a.status}
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* 🔥 UPCOMING */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">

        <h2 className="font-semibold mb-4">Upcoming (Next Few)</h2>

        {todayList.slice(0, 5).map(a => (
          <div key={a.id} className="text-sm mb-2">
            {new Date(a.dateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} — Patient #{a.patientId}
          </div>
        ))}

      </div>

    </ReceptionistLayout>
  );
}