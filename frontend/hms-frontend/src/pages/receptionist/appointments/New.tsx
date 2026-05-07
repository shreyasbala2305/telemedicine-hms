import React, { useEffect, useState } from "react";
import { createAppointment } from "../../../services/appointmentService";
import { getPatients } from "../../../services/patientService";
import { getDoctors } from "../../../services/doctorService";
import { getAvailableSlots } from "../../../services/appointmentService";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ReceptionistLayout from "../../../layouts/ReceptionistLayout";

export default function ReceptionistAppointmentNew() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [params] = useSearchParams();
  const preselectedPatient = params.get("patientId");

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    dateTime: "",
    description: "",
  });

  useEffect(() => {
    (async () => {
      const p = await getPatients();
      const d = await getDoctors();
      setPatients(p || []);
      setDoctors(d || []);
    })();
  }, []);

  useEffect(() => {
    if (!form.doctorId || !selectedDate) {
        setSlots([]);
        return;
    }

    (async () => {
        try {
        setLoadingSlots(true);

        const data = await getAvailableSlots(
            Number(form.doctorId),
            selectedDate
        );

        setSlots(data || []);
        } catch (err) {
        console.error("Slot fetch failed", err);
        setSlots([]);
        } finally {
        setLoadingSlots(false);
        }
    })();
    }, [form.doctorId, selectedDate]);

    useEffect(() => {
      if (preselectedPatient) {
        setForm(prev => ({
          ...prev,
          patientId: preselectedPatient
        }));
      }
    }, [preselectedPatient]);

  // 🔍 FILTERED LISTS
  const filteredPatients = patients.filter((p) =>
    (p.name || "").toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredDoctors = doctors.filter((d) =>
    (d.name || "").toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.patientId || !form.doctorId) {
        toast.error("Select patient and doctor");
        return;
    }

    if (!selectedDate) {
      toast.error("Please select date");
      return;
    }

    const dateTime = selectedSlot
      ? `${selectedDate}T${selectedSlot}`
      : `${selectedDate}T10:00`; // default time


    setLoading(true);

    try {
        await createAppointment({
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        dateTime,
        status: "CONFIRMED",
        });

        toast.success("Appointment booked");
        navigate("/receptionist/appointments");
    } catch (err: any) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
        setLoading(false);
    }
    };

  return (
    <ReceptionistLayout>
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Book Appointment</h1>
          <p className="text-sm text-gray-500">
            Receptionist booking (auto-confirmed)
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow space-y-5">

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* PATIENT */}
            <div>
              <label className="block text-sm mb-1">Patient</label>

              <input
                placeholder="Search patient..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 dark:bg-gray-800"
              />

              <select
                value={form.patientId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, patientId: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded dark:bg-gray-800"
                required
              >
                <option value="">Select patient</option>
                {filteredPatients.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name} (#{p.id})
                  </option>
                ))}
              </select>
            </div>

            {/* DOCTOR */}
            <div>
              <label className="block text-sm mb-1">Doctor</label>

              <input
                placeholder="Search doctor..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 dark:bg-gray-800"
              />

              <select
                value={form.doctorId}
                onChange={(e) => {
                setForm(prev => ({ ...prev, doctorId: e.target.value }));
                setSlots([]);
                setSelectedSlot("");
                }}
                className="w-full px-4 py-2 border rounded dark:bg-gray-800"
                required
              >
                <option value="">Select doctor</option>
                {filteredDoctors.map((d) => (
                  <option key={d.id} value={String(d.id)}>
                    {d.name} — {d.speciality}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE TIME */}
            {/* <div>
              <label className="block text-sm mb-1">Date & Time</label>
              <input
                value={form.dateTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, dateTime: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded dark:bg-gray-800"
                required
              />
            </div> */}
            <div>
              <label className="block text-sm mb-1">Select Date</label>
              <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]} // 🔥 no past dates
                  onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(""); // reset slot
                  }}
                  className="w-full px-4 py-2 border rounded dark:bg-gray-800"
              />
            </div>

            <div>
                <label className="block text-sm mb-2">Available Slots</label>

                {loadingSlots ? (
                    <div className="text-sm text-gray-500">Loading slots...</div>
                ) : slots.length === 0 ? (
                    <div className="text-sm text-yellow-600">
                      No slots available — booking will use default time
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                        <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-1 rounded border transition ${
                            selectedSlot === slot
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-800"
                        }`}
                        >
                        {slot}
                        </button>
                    ))}
                    </div>
                )}
              </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm mb-1">Notes</label>
              <input
                placeholder="Optional notes"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded dark:bg-gray-800"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || (slots.length > 0 && !selectedSlot)}
                className={`px-4 py-2 rounded text-white ${
                  slots.length > 0 && !selectedSlot
                    ? "bg-gray-400"
                    : "bg-primary"
                }`}
              >
                {loading ? "Booking..." : "Book Appointment"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/receptionist/appointments")}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </div>
    </ReceptionistLayout>
  );
}