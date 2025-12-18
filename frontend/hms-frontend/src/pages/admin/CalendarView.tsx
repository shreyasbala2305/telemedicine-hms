import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { listDoctors } from "../../services/availabilityService";
import DoctorCalendar from "../../components/calender/DoctorCalender";

export default function AdminCalendarView() {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [doctors, setDoctors] = React.useState<any[]>([]);
  React.useEffect(()=>{ (async()=> setDoctors(await listDoctors()) )(); }, []);
  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <select className="px-3 py-2 border rounded" value={doctorId || ""} onChange={e => setDoctorId(Number(e.target.value)||null)}>
          <option value="">Select Doctor</option>
          {doctors.map(d=> <option key={d.id} value={d.id}>{d.name} — {d.speciality}</option>)}
        </select>
      </div>
      {doctorId ? <DoctorCalendar doctorIdProp={doctorId} /> : <div className="text-gray-500">Select a doctor to view calendar</div>}
    </DashboardLayout>
  );
}
