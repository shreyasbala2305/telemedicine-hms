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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <Link to="/doctor/prescriptions/new" className="bg-primary text-white px-4 py-2 rounded">+ New</Link>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <tr key={i} className="border-t animate-pulse">
              {Array(5).fill(0).map((_, j) => (
                <td key={j} className="p-3">
                  <div className="h-4 w-full max-w-[150px] bg-gray-300 dark:bg-gray-700 rounded"></div>
                </td>
              ))}
            </tr>
          ))
        ) : items.length===0 ? <div>No prescriptions</div> : (
          <div className="space-y-3">
            {items.map(it=>(
              <div key={it.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">Prescription #{it.id} — Patient #{it.patientId}</div>
                  <div className="text-sm text-gray-500">{it.diagnosis}</div>
                </div>
                <div>
                  <Link to={`/doctor/prescriptions/${it.id}`} className="text-blue-600">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
