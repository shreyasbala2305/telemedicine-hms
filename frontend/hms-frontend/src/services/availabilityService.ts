// src/services/availabilityService.ts
import api from "./api";
import { MOCK_MODE } from "../config";
import { getAppointments } from "./appointmentService";
import { getDoctors } from "./doctorService";

/**
 * Expected backend endpoints (used if available):
 *  - GET /doctor-service/doctors -> list doctors (we already have doctorService)
 *  - GET /doctor-service/doctors/{id}/availability?date=YYYY-MM-DD -> returns { slots: ["09:00","09:30", ...] }
 *  - POST /appointment-service/appointments -> create appointment payload
 *
 * Fallback: compute slots client-side based on a default schedule and existing appointments.
 */

export interface Slot {
  time: string; // "09:30"
  iso: string;  // "2025-09-14T09:30:00"
  available: boolean;
}

export async function listDoctors() {
  if (MOCK_MODE) {
    return Promise.resolve([
      { id: 11, name: "Dr. A", speciality: "Cardiology" },
      { id: 12, name: "Dr. B", speciality: "Orthopedic" },
      { id: 13, name: "Dr. C", speciality: "General" },
    ]);
  }
  return getDoctors();
}

/**
 * Try to fetch availability for a doctor on a date from backend.
 * If backend doesn't support it, fall back to computing slots between start/end time,
 * excluding times already taken by appointments.
 */
export async function getAvailability(doctorId: number | string, date: string): Promise<Slot[]> {
  // date in "YYYY-MM-DD"
  if (MOCK_MODE) {
    // mock: return a few slots
    const base = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30"];
    return base.map(t => ({
      time: t,
      iso: `${date}T${t}:00`,
      available: Math.random() > 0.25, // some occupied
    }));
  }

  // Try backend endpoint first
  try {
    const res = await api.get(`/doctor-service/doctors/${doctorId}/availability?date=${date}`);
    if (res?.data?.slots && Array.isArray(res.data.slots)) {
      return res.data.slots.map((t: string) => ({ time: t, iso: `${date}T${t}:00`, available: true }));
    }
  } catch (err) {
    // ignore and fallback
  }

  // Fallback: compute from appointments
  try {
    const all = await getAppointments();
    const dayApps = (all || []).filter((a: any) => String(a.doctorId) === String(doctorId) && a.appointmentDate?.startsWith(date));
    // take a default schedule (9:00-12:00, 14:00-17:00) with 30-min slots
    const slots = generateSlotsForDate(date, "09:00", "12:00", 30).concat(generateSlotsForDate(date, "14:00", "17:00", 30));
    const taken = new Set(dayApps.map((a: any) => {
      // map appointmentDate to hh:mm
      const d = new Date(a.appointmentDate);
      return d.toTimeString().slice(0,5);
    }));
    return slots.map(s => ({ time: s, iso: `${date}T${s}:00`, available: !taken.has(s) }));
  } catch (err) {
    // If everything fails, return empty
    return [];
  }
}

function generateSlotsForDate(date: string, start: string, end: string, minutes = 30): string[] {
  // start/end are "HH:MM"
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startDate = new Date(`${date}T${pad(sh)}:${pad(sm)}:00`);
  const endDate = new Date(`${date}T${pad(eh)}:${pad(em)}:00`);
  const slots: string[] = [];
  for (let d = new Date(startDate); d < endDate; d.setMinutes(d.getMinutes() + minutes)) {
    slots.push(d.toTimeString().slice(0,5));
  }
  return slots;
}
function pad(n:number) { return n < 10 ? `0${n}` : `${n}`; }

/**
 * Create booking
 * Payload expected by backend:
 * {
 *   patientId: "9",
 *   doctorId: "11",
 *   appointmentDate: "2025-09-14T10:45:00",
 *   status: "CONFIRMED"
 * }
 */
export async function createBooking(payload: { patientId: string; doctorId: string | number; appointmentDate: string; status?: string; description?: string }) {
  if (MOCK_MODE) {
    // simulate network
    return new Promise((res) => setTimeout(() => res({ id: Math.floor(Math.random()*10000), ...payload }), 700));
  }
  const res = await api.post(`/appointment-service/appointments`, {
    ...payload,
    status: payload.status || "CONFIRMED",
  });
  return res.data;
}

export interface Availability {
  date?: string; // for single-day availability (optional)
  weekdays?: number[]; // 0-6 for recurring weekly slots
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  slotMinutes: number; // 15 | 30
  breaks?: { start: string; end: string }[]; // optional
}

/**
 * Save availability for a doctor (admin or doctor)
 * POST /doctor-service/doctors/{id}/availability  { availability }
 */
export async function saveAvailability(doctorId: number | string, payload: Availability) {
  if (MOCK_MODE) {
    return new Promise(resolve => setTimeout(() => resolve({ success: true, ...payload }), 500));
  }
  const res = await api.post(`/doctor-service/doctors/${doctorId}/availability`, payload);
  return res.data;
}

/**
 * Try to fetch stored availability rules (server)
 * GET /doctor-service/doctors/{id}/availability
 */
export async function getSavedAvailability(doctorId: number | string) {
  if (MOCK_MODE) {
    return Promise.resolve({ startTime: "09:00", endTime: "17:00", slotMinutes: 30, weekdays: [1,2,3,4,5] });
  }
  const res = await api.get(`/doctor-service/doctors/${doctorId}/availability`);
  return res.data;
}
