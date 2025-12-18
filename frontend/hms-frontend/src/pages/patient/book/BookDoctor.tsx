// src/pages/patient/book/BookDoctor.tsx
import React, { useEffect, useState } from "react";
import PatientLayout from "../../../layouts/PatientLayout";
import { useParams, useNavigate } from "react-router-dom";
import { getAvailability, createBooking } from "../../../services/availabilityService";
import SlotButton from "../../../components/ui/SlotButton";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

export default function BookDoctor() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  // user id extraction helper — adapt to your JWT structure
  const getUserIdFromToken = () => {
    if (!token) return null;
    try { const p = JSON.parse(atob(token.split(".")[1])); return p.sub || p.userId || p.id || null; } catch { return null; }
  };

  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0,10); // YYYY-MM-DD
  });
  const [slots, setSlots] = useState<{ time:string; iso:string; available:boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  const loadSlots = async () => {
    if (!doctorId) return;
    setLoading(true);
    const list = await getAvailability(Number(doctorId), date);
    setSlots(list || []);
    setSelected(null);
    setLoading(false);
  };

  useEffect(() => { loadSlots(); }, [doctorId, date]);

  const handleBook = async () => {
    if (!selected || !doctorId) {
      toast.error("Select a time slot first");
      return;
    }
    const patientId = getUserIdFromToken();
    if (!patientId) {
      toast.error("Unable to determine patient id from token. Please login.");
      return;
    }
    setBooking(true);
    try {
      const iso = selected.includes("T") ? selected : `${date}T${selected}:00`;
      await createBooking({ patientId: String(patientId), doctorId: Number(doctorId), appointmentDate: iso, status: "CONFIRMED" });
      toast.success("Appointment booked");
      navigate("/patient/appointments");
    } catch (err) {
      toast.error("Booking failed");
    } finally {
      setBooking(false);
    }
  };

  return (
    <PatientLayout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Book with Doctor #{doctorId}</h1>
          <div className="text-sm text-gray-500">Select date and choose a slot</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow max-w-3xl">
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Choose Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 border rounded" />
        </div>

        <div>
          <h3 className="font-medium mb-3">Available slots</h3>
          {loading ? <div>Loading slots...</div> : slots.length === 0 ? <div className="text-sm text-gray-500">No slots available for the selected date.</div> : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {slots.map(s => (
                <SlotButton key={s.iso} time={s.time} disabled={!s.available} selected={selected === s.iso || selected === s.time} onClick={() => s.available ? setSelected(s.iso || s.time) : null} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={handleBook} disabled={!selected || booking} className="bg-primary text-white px-4 py-2 rounded">
            {booking ? "Booking..." : "Confirm Booking"}
          </button>
          <button onClick={() => navigate("/patient/book")} className="px-4 py-2 border rounded">Back</button>
        </div>
      </div>
    </PatientLayout>
  );
}
