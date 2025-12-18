// src/components/calendar/DoctorCalendar.tsx
import React, { useEffect, useRef, useState } from "react";
import FullCalendar, { DateSelectAr, EventApi, EventClickArg } from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getAppointmentsByDoctor } from "../../services/appointmentService";
import { getSavedAvailability } from "../../services/availabilityService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { createBooking } from "../../services/availabilityService";

export default function DoctorCalendar({ doctorIdProp }: { doctorIdProp?: string | number }) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const { token } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getDoctorIdFromToken = () => {
    if (doctorIdProp) return doctorIdProp;
    if (!token) return null;
    try { const p = JSON.parse(atob(token.split(".")[1])); return p.sub || p.id || p.doctorId || null; } catch { return null; }
  };

  const fetchEvents = async (start: string, end: string) => {
    const docId = getDoctorIdFromToken();
    if (!docId) return;
    setLoading(true);
    try {
      const res = await getAppointmentsByDoctor(docId);
      // filter by date range (server should do this; frontend filters if not)
      const filtered = (res || []).filter((a:any) => {
        const d = new Date(a.appointmentDate);
        return d >= new Date(start) && d <= new Date(end);
      });
      const mapped = filtered.map((a:any) => ({
        id: String(a.id),
        title: `P#${a.patientId} — ${a.status}`,
        start: a.appointmentDate,
        end: a.appointmentDate, // you can compute end using slot duration
        extendedProps: a,
        backgroundColor: a.status === "CONFIRMED" ? "#0ea5a4" : "#3b82f6"
      }));
      setEvents(mapped);
    } finally { setLoading(false); }
  };

  // on date-range change FullCalendar calls this lifecycle method; we'll attach a small hook
  const handleDatesSet = async (arg: any) => {
    const startIso = arg.startStr;
    const endIso = arg.endStr;
    await fetchEvents(startIso, endIso);
  };

  const handleSelect = async (selectInfo: DateSelectArg) => {
    // patient booking via calendar selection only allowed in patient view; doctors/admin use event creation UI
    // For example usage: show a confirm modal to create appointment at selectInfo.startStr
    const confirmCreate = confirm(`Create appointment at ${new Date(selectInfo.start).toLocaleString()}?`);
    if (!confirmCreate) return;
    // use createBooking: note patientId must be set; this is a simplified example for doctor/admin creating appointment
    try {
      // use a prompt to get patient id quickly (or open a proper modal)
      const patientId = prompt("Enter patient id");
      if (!patientId) return;
      await createBooking({ patientId: String(patientId), doctorId: getDoctorIdFromToken(), appointmentDate: selectInfo.startStr, status: "CONFIRMED" });
      toast.success("Appointment created");
      // refresh
      await fetchEvents(selectInfo.startStr, selectInfo.endStr);
    } catch (err) {
      toast.error("Create failed");
    }
  };

  const handleEventClick = (e: EventClickArg) => {
    const props = e.event.extendedProps;
    // show details modal or navigate to appointment detail
    const id = e.event.id;
    window.location.href = `/doctor/appointments/${id}`; // or use navigate
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        initialView="timeGridWeek"
        selectable={true}
        selectMirror={true}
        editable={false}
        events={events}
        datesSet={handleDatesSet}
        select={handleSelect}
        eventClick={handleEventClick}
        height="auto"
        nowIndicator
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
      />
      {loading && <div className="text-sm text-gray-500 mt-2">Loading appointments...</div>}
    </div>
  );
}
