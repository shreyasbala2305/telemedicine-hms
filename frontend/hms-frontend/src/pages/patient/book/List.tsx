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
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const docs = await listDoctors();
      setDoctors(docs || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, []);

  const filtered = doctors.filter(d => {
    if (!query) return true;
    const q = query.toLowerCase();
    return String(d.name).toLowerCase().includes(q) || String(d.speciality||"").toLowerCase().includes(q);
  });

  return (
    <PatientLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Book Appointment</h1>
            <p className="text-gray-500 text-sm">
              Find the right doctor and book your slot
            </p>
          </div>

          <div className="w-full md:w-80">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search doctors..."
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow animate-pulse h-40"
                />
              ))
            : filtered.map(d => (
                <div
                  key={d.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition flex flex-col justify-between"
                >

                  {/* TOP */}
                  <div className="flex items-center gap-4">

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {d.name?.charAt(0)}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="font-semibold text-gray-800">
                        {d.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {d.speciality || "General"}
                      </div>
                    </div>
                  </div>

                  {/* Middle */}
                  <div className="mt-4 text-sm text-gray-500">
                    <div>Doctor ID: #{d.id}</div>
                    {d.qualification && (
                      <div className="mt-1 text-xs text-gray-400">
                        {d.qualification}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-5">
                    <Link
                      to={`/patient/book/${d.id}`}
                      className="block text-center w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                      Book Appointment
                    </Link>
                  </div>

                </div>
              ))}
        </div>

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-lg font-medium">
              No doctors found
            </div>
            <div className="text-sm">
              Try adjusting your search
            </div>
          </div>
        )}

      </div>
    </PatientLayout>
  );
}
