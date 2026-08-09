import React, { useEffect, useMemo, useState } from "react";
import PatientLayout from "../../../layouts/PatientLayout";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctor } from "../../../services/doctorService";
import {
  getAvailableSlots,
  createAppointment,
} from "../../../services/appointmentService";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DoctorBooking() {

  const params = useParams();

  // 🔥 IMPORTANT DEBUG
  console.log("ROUTE PARAMS:", params);

  const id = params.doctorId;

  const { token } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // 🔥 patient id
  const getPatientId = () => {

    try {

      if (!token) return null;

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return payload.userId || payload.id || null;

    } catch {

      return null;

    }
  };

  // 🔥 today
  const todayName = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    }
  );

  // 🔥 availability days
  const availableDays = useMemo(() => {
    console.log("DOCTOR STATE:", doctor);
    if (!doctor?.availability) return [];
    return doctor.availability.map(
      (a: string) => a.split(" ")[0]
    );
  }, [doctor]);

  // 🔥 validate day
  const isValidDoctorDay = (date: string) => {
    if (!date) return false;
    const parsed = new Date(
      date + "T00:00:00"
    );
    const day =
      weekDays[parsed.getDay()];
    return availableDays.includes(day);
  };

  // 🔥 load doctor
  useEffect(() => {
    console.log("BOOK PAGE MOUNTED");
    if (!id) {
      console.error("NO DOCTOR ID FOUND");
      return;
    }

    (async () => {
      try {
        console.log("FETCHING DOCTOR:", id);
        const d = await getDoctor(Number(id));
        console.log("DOCTOR RESPONSE:", d);
        setDoctor(d);
        // 🔥 auto-select today
        if (
          d?.availability?.some(
            (a: string) =>
              a.startsWith(todayName)
          )
        ) {
          setSelectedDate(
            new Date()
              .toISOString()
              .split("T")[0]
          );
        }
      } catch (err) {
        console.error(
          "DOCTOR FETCH FAILED:",
          err
        );
      }
    })();
  }, [id, todayName]);

  // 🔥 fetch slots
  useEffect(() => {

    if (!id || !selectedDate) return;

    if (!isValidDoctorDay(selectedDate)) {

      setSlots([]);

      return;
    }

    (async () => {
      try {
        setLoadingSlots(true);
        console.log(
          "FETCHING SLOTS:",
          selectedDate
        );
        const data =
          await getAvailableSlots(
            Number(id),
            selectedDate
          );
        console.log(
          "SLOTS RESPONSE:",
          data
        );
        setSlots(data || []);
      } catch (err) {
        console.error(
          "SLOT FETCH FAILED:",
          err
        );
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, [id, selectedDate]);

  // 🔥 book
  const book = async () => {
    if (!selectedSlot) {
      return toast.error("Select a slot");
    }

    const patientId = getPatientId();
    if (!patientId) {
      return toast.error("Login required");
    }

    try {
      await createAppointment({
        patientId,
        doctorId: Number(id),
        dateTime: `${selectedDate}T${selectedSlot}`,
        status: "PENDING",
      });

      toast.success(
        `Appointment booked with ${doctor?.name} on ${selectedDate} at ${selectedSlot}`,
        {
          duration: 5000,
        }
      );

      setSelectedSlot("");
      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1200);

    } catch {
      toast.error("Booking failed");
    }
  };

  return (
    <PatientLayout>

      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8">

          {/* DOCTOR */}
          <div>

            <h1 className="text-3xl font-bold">
              {doctor?.name || "Loading..."}
            </h1>

            <p className="text-gray-500 mt-1">
              {doctor?.speciality}
            </p>

            {/* AVAILABILITY */}
            <div className="mt-5">

              {availableDays.length === 0 ? (

                <div className="text-gray-400">
                  No availability configured
                </div>

              ) : (

                <div className="flex flex-wrap gap-2">

                  {availableDays.map(
                    (day: string) => (

                    <span
                      key={day}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        day === todayName
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {day === todayName
                        ? "🟢 Available Today"
                        : day}
                    </span>

                  ))}

                </div>

              )}

            </div>

          </div>

          {/* DATE */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Select Appointment Date
            </label>

            <input
              type="date"
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              value={selectedDate}
              onChange={(e) => {

                setSelectedDate(
                  e.target.value
                );

                setSelectedSlot("");

              }}
              className="px-4 py-3 border rounded-xl"
            />

            {selectedDate &&
              !isValidDoctorDay(
                selectedDate
              ) && (

              <div className="text-red-500 text-sm mt-3">
                Doctor unavailable on selected day
              </div>

            )}

          </div>

          {/* SLOTS */}
          <div>

            <h2 className="font-semibold text-lg mb-4">
              Available Slots
            </h2>

            {loadingSlots ? (

              <div>
                Loading slots...
              </div>

            ) : !selectedDate ? (

              <div className="text-gray-500">
                Select a date first
              </div>

            ) : !isValidDoctorDay(
                selectedDate
              ) ? (

              <div className="text-gray-500">
                No slots for this day
              </div>

            ) : slots.length === 0 ? (

              <div className="text-gray-500">
                No slots available
              </div>

            ) : (

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                {slots.map((slot) => (

                  <button
                    key={slot}
                    onClick={() =>
                      setSelectedSlot(slot)
                    }
                    className={`py-3 rounded-xl border transition ${
                      selectedSlot === slot
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {slot}
                  </button>

                ))}

              </div>

            )}

          </div>

          {/* BUTTON */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              disabled={!selectedSlot}
              onClick={book}
              className={`px-6 py-3 rounded-xl text-white font-medium transition ${
                selectedSlot
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Book Appointment
            </button>

          </div>
        </div>

      </div>

    </PatientLayout>
  );
}