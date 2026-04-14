import React, { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { getDoctors } from "../../services/doctorService";
import { useNavigate } from "react-router-dom";

export default function PatientDoctorSearch() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [speciality, setSpeciality] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxFee, setMaxFee] = useState(1000);

  useEffect(() => {
    (async () => {
      const data = await getDoctors();
      setDoctors(data);
      setFiltered(data);
    })();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();

    let result = doctors.filter(d =>
        d.name.toLowerCase().includes(s) ||
        d.speciality?.toLowerCase().includes(s)
    );

    if (speciality) {
        result = result.filter(d =>
        d.speciality?.toLowerCase() === speciality.toLowerCase()
        );
    }

    if (availableOnly) {
        // assuming all are available (mock)
        result = result.filter(() => true);
    }

    result = result.filter(d => (d.fee || 500) <= maxFee);

    setFiltered(result);
    }, [search, doctors, speciality, availableOnly, maxFee]);

  return (
    <PatientLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Find a Doctor 👨‍⚕️</h1>
          <p className="text-gray-500 text-sm">
            Search by name or specialty
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search doctor or specialty..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="bg-white p-5 rounded-2xl shadow flex flex-col md:flex-row gap-4">

        {/* SPECIALITY */}
        <select
            value={speciality}
            onChange={e => setSpeciality(e.target.value)}
            className="px-3 py-2 border rounded-lg"
        >
            <option value="">All Specialities</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Dermatology">Dermatology</option>
        </select>

        {/* AVAILABILITY */}
        <label className="flex items-center gap-2 text-sm">
            <input
            type="checkbox"
            checked={availableOnly}
            onChange={e => setAvailableOnly(e.target.checked)}
            />
            Available Today
        </label>

        {/* FEE */}
        <div className="flex items-center gap-2">
            <span className="text-sm">Max Fee:</span>
            <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={maxFee}
            onChange={e => setMaxFee(Number(e.target.value))}
            />
            <span className="text-sm font-medium">₹{maxFee}</span>
        </div>
        
        <button
            onClick={() => {
                setSpeciality("");
                setAvailableOnly(false);
                setMaxFee(1000);
                setSearch("");
            }}
            className="text-sm text-blue-600 underline"
            >
            Clear Filters
        </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">

          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No doctors found
            </div>
          ) : (

            filtered.map(d => (
              <div
                key={d.id}
                className="bg-white p-5 rounded-2xl shadow flex flex-col md:flex-row md:justify-between md:items-center"
              >

                {/* LEFT */}
                <div className="flex gap-4">

                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {d.name?.charAt(0)}
                  </div>

                  <div>
                    <div className="font-semibold text-lg">{d.name}</div>
                    <div className="text-sm text-gray-500">
                      {d.speciality || "General"}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {d.qualification}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                        ₹{d.fee || 500} Consultation
                    </div>
                  </div>

                </div>

                {/* RIGHT */}
                <div className="mt-3 md:mt-0 flex flex-col items-end gap-2">

                  <div className="text-green-600 text-sm font-medium">
                    Available Today
                  </div>

                  <button
                    onClick={() => navigate(`/patient/doctors/${d.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Book Appointment
                  </button>

                </div>

              </div>
            ))

          )}

        </div>
      </div>
    </PatientLayout>
  );
}