// src/pages/doctor/prescriptions/List.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import DoctorLayout from "../../../layouts/DoctorLayout";
import { getPrescriptionsByDoctor } from "../../../services/prescriptionService";

export default function DoctorPrescriptions() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getDoctorIdFromToken = () => {
    if (!token) return null;
    try { const p = JSON.parse(atob(token.split(".")[1])); return p.sub || p.id || p.doctorId || null; } catch { return null; }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const docId = getDoctorIdFromToken();

        if (!docId) {
          setItems([]);
          return;
        }

        const res = await getPrescriptionsByDoctor(docId);
        setItems(res || []);
      } catch (err) {
        console.error("Failed to load prescriptions", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <DoctorLayout>

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions 💊</h1>
          <p className="text-gray-500 text-sm">
            Manage and view patient prescriptions
          </p>
        </div>

        <Link
          to="/doctor/prescriptions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Prescription
        </Link>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 animate-pulse rounded-xl" />
          ))
        ) : items.length === 0 ? (

          <div className="col-span-full text-center py-10 bg-white rounded-2xl shadow">
            <p className="text-lg font-medium text-gray-700">
              No prescriptions found
            </p>
          </div>

        ) : (

          items.map((it) => (
            <div
              key={it.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition border"
            >

              <div className="flex justify-between items-start">

                <div>
                  <h2 className="font-semibold text-lg">
                    Prescription #{it.id}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Patient ID: #{it.patientId}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    {it.diagnosis || "No diagnosis"}
                  </p>
                </div>

                <Link
                  to={`/doctor/prescriptions/${it.id}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View →
                </Link>

              </div>

            </div>
          ))

        )}

      </div>
    </DoctorLayout>
  );
}
