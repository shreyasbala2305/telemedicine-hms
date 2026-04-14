import React, { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctor } from "../../services/doctorService";

export default function PatientDoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const data = await getDoctor(Number(id));
      setDoctor(data);
    })();
  }, [id]);

  if (!doctor) {
    return (
      <PatientLayout>
        <div className="animate-pulse h-40 bg-gray-200 rounded-xl" />
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER CARD */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row gap-6">

          {/* AVATAR */}
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
            {doctor.name?.charAt(0)}
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{doctor.name}</h1>

            <p className="text-gray-500">
              {doctor.speciality || "General Physician"}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              {doctor.qualification}
            </p>

            {/* RATING */}
            <div className="mt-2 text-yellow-500 text-sm">
              ⭐ 4.5 (120 reviews)
            </div>

            {/* EXPERIENCE */}
            <div className="text-sm text-gray-600 mt-2">
              8+ years experience
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/patient/book/${doctor.id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>

        </div>

        {/* ABOUT */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold text-lg mb-2">About Doctor</h2>
          <p className="text-gray-600 text-sm">
            Experienced {doctor.speciality} specialist dedicated to patient care.
            Provides consultation, diagnosis, and treatment with modern techniques.
          </p>
        </div>

        {/* DETAILS */}
        <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-2 gap-4 text-sm">

          <div>
            <strong>Specialization:</strong>
            <p>{doctor.speciality || "General"}</p>
          </div>

          <div>
            <strong>Qualification:</strong>
            <p>{doctor.qualification}</p>
          </div>

          <div>
            <strong>Contact:</strong>
            <p>{doctor.contact}</p>
          </div>

          <div>
            <strong>Consultation Fee:</strong>
            <p>₹500</p>
          </div>

        </div>

      </div>
    </PatientLayout>
  );
}