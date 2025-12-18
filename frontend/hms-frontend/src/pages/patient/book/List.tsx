// src/pages/patient/book/List.tsx
import React, { useEffect, useState } from "react";
import PatientLayout from "../../../layouts/PatientLayout";
import { listDoctors } from "../../../services/availabilityService";
import SearchBar from "../../../components/ui/SearchBar";
import { Link } from "react-router-dom";

export default function BookList() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const docs = await listDoctors();
      setDoctors(docs || []);
      setLoading(false);
    })();
  }, []);

  const filtered = doctors.filter(d => {
    if (!query) return true;
    const q = query.toLowerCase();
    return String(d.name).toLowerCase().includes(q) || String(d.speciality||"").toLowerCase().includes(q);
  });

  return (
    <PatientLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Book Appointment</h1>
          <p className="text-sm text-gray-500">Choose a doctor and book a slot</p>
        </div>

        <div className="w-80">
          <SearchBar value={query} onChange={setQuery} placeholder="Search doctors by name or speciality" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array.from({length:6}).map((_,i)=>(<div key={i} className="bg-white p-4 rounded-2xl shadow animate-pulse h-28"/>)) :
          filtered.map(d => (
          <div key={d.id} className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between">
            <div>
              <div className="font-semibold">{d.name}</div>
              <div className="text-sm text-gray-500">{d.speciality}</div>
              <div className="text-xs text-gray-400 mt-2">Dr ID: {d.id}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link to={`/patient/book/${d.id}`} className="bg-primary text-white px-4 py-2 rounded">Book</Link>
            </div>
          </div>
        ))}
      </div>
    </PatientLayout>
  );
}
