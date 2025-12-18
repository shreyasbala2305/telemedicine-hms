// src/pages/patient/prescriptions/List.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import PatientLayout from "../../../layouts/PatientLayout";
import { getPrescriptionsByPatient } from "../../../services/prescriptionService";

export default function PatientPrescriptions() {
  const { token } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserIdFromToken = () => {
    if (!token) return null;
    try { const p = JSON.parse(atob(token.split(".")[1])); return p.sub || p.userId || p.id || null; } catch { return null; }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const userId = getUserIdFromToken();
      const res = await getPrescriptionsByPatient(userId || "");
      setList(res || []);
      setLoading(false);
    })();
  }, [token]);

  return (
    <PatientLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Prescriptions</h1>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        {loading ? <div>Loading...</div> : list.length===0 ? <div>No prescriptions</div> : (
          <div className="space-y-3">
            {list.map(it=>(
              <div key={it.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">Prescription #{it.id}</div>
                  <div className="text-sm text-gray-500">{it.diagnosis}</div>
                </div>
                <div><Link to={`/patient/prescriptions/${it.id}`} className="text-blue-600">View</Link></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
