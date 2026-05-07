import { useEffect, useState } from "react";
import { getAppointmentsPaged, updateAppointmentStatus } from "../../../services/appointmentService";
import { getPatientsByIds } from "../../../services/patientService";
import { getDoctors } from "../../../services/doctorService";
import toast from "react-hot-toast";
import ReceptionistLayout from "../../../layouts/ReceptionistLayout";

export default function TodayQueue() {

  const [appointments, setAppointments] = useState<any[]>([]);
  const [patientMap, setPatientMap] = useState<Record<number, string>>({});
  const [doctorMap, setDoctorMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const load = async () => {
    setLoading(true);

    try {
      const data = await getAppointmentsPaged({
        page: 0,
        pageSize: 100,
      });

      // 🔥 filter today's
      const todayList = (data.content || []).filter((a: any) =>
        a.dateTime?.startsWith(today)
      );

      // 🔥 sort by time
      todayList.sort(
        (a: any, b: any) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );

      setAppointments(todayList);

      // 🔥 map patients
      const patientIds = [...new Set(todayList.map((a: any) => a.patientId))] as (number | string)[];
      const patients = await getPatientsByIds(patientIds);
      const pMap: any = {};
      patients.forEach((p: any) => (pMap[p.id] = p.name));
      setPatientMap(pMap);

      // 🔥 map doctors
      const doctors = await getDoctors();
      const dMap: any = {};
      doctors.forEach((d: any) => (dMap[d.id] = d.name));
      setDoctorMap(dMap);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Updated to ${status}`);
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <ReceptionistLayout>

      <h1 className="text-2xl font-bold mb-6">Today's Queue</h1>

      <div className="space-y-3">

        {loading ? (
          <div>Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-gray-500">No appointments today</div>
        ) : (
          appointments.map((a) => (

            <div
              key={a.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center"
            >

              {/* LEFT */}
              <div>
                <div className="font-semibold">
                  {patientMap[a.patientId] || `#${a.patientId}`}
                </div>

                <div className="text-sm text-gray-500">
                  Dr. {doctorMap[a.doctorId]}
                </div>

                <div className="text-xs text-gray-400">
                  {new Date(a.dateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* STATUS */}
              <div className="text-sm font-medium">
                {a.status}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">

                {a.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => updateStatus(a.id, "CONFIRMED")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(a.id, "CANCELLED")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {a.status === "CONFIRMED" && (
                  <button
                    onClick={() => updateStatus(a.id, "COMPLETED")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Complete
                  </button>
                )}

              </div>

            </div>
          ))
        )}

      </div>

    </ReceptionistLayout>
  );
}