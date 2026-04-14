import React, { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { getPrescriptionsByPatient } from "../../services/prescriptionService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function PatientPrescriptions() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  const getUserId = () => {
    try {
      const p = JSON.parse(atob(token.split(".")[1]));
      return p.sub || p.userId || p.id;
    } catch { return null; }
  };

  useEffect(() => {
    (async () => {
      const id = getUserId();
      if (!id) return;
      const data = await getPrescriptionsByPatient(id);
      setItems(data || []);
    })();
  }, []);

  return (
    <PatientLayout>
      <h1 className="text-2xl font-bold mb-4">My Prescriptions</h1>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div>No prescriptions</div>
        ) : (
          items.map(p => (
            <div key={p.id} className="p-4 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-medium">Prescription #{p.id}</div>
                <div className="text-sm text-gray-500">{p.diagnosis}</div>
              </div>
              <Link to={`/patient/prescriptions/${p.id}`} className="text-blue-600">
                View →
              </Link>
            </div>
          ))
        )}
      </div>
    </PatientLayout>
  );
}