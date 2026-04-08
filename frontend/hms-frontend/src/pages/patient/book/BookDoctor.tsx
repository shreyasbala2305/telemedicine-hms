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
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Book Appointment
            </h1>
            <p className="text-gray-500 text-sm">
              Select date and preferred time slot
            </p>
          </div>
        </div>

        {/* DOCTOR CARD */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
            D
          </div>

          <div>
            <div className="font-semibold text-lg">
              Doctor #{doctorId}
            </div>
            <div className="text-sm text-gray-500">
              Specialist • Available slots
            </div>
          </div>
        </div>

        {/* DATE PICKER */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <label className="block text-sm text-gray-600 mb-2">
            Select Date
          </label>

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* SLOTS */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <h3 className="font-semibold mb-4 text-lg">
            Available Slots
          </h3>

          {loading ? (
            <div className="text-gray-500">Loading slots...</div>
          ) : slots.length === 0 ? (
            <div className="text-sm text-gray-500">
              No slots available for this date
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {slots.map(s => {
                const isSelected = selected === s.iso || selected === s.time;

                return (
                  <button
                    key={s.iso}
                    disabled={!s.available}
                    onClick={() => s.available && setSelected(s.iso || s.time)}
                    className={`py-2 rounded-full text-sm border transition
                      ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : s.available
                          ? "hover:bg-blue-50"
                          : "opacity-40 cursor-not-allowed"
                      }
                    `}
                  >
                    {s.time}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/patient/book")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Back
          </button>

          <button
            onClick={handleBook}
            disabled={!selected || booking}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
              booking
                ? "bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {booking ? "Booking..." : "Confirm Booking"}
          </button>
        </div>

      </div>
    </PatientLayout>
  );
}
