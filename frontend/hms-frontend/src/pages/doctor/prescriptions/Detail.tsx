// src/pages/doctor/prescriptions/Detail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPrescription } from "../../../services/prescriptionService";
import DoctorLayout from "../../../layouts/DoctorLayout";

export default function PrescriptionDetail() {
  const { id } = useParams<{ id: string }>();
  const [pres, setPres] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setPres(await getPrescription(Number(id)));
    })();
  }, [id]);

  if (!pres) return <DoctorLayout><div>animate-pulse skeleton</div></DoctorLayout>;

  return (
    <DoctorLayout>
      <h1 className="text-2xl font-bold mb-4">Prescription #{pres.id}</h1>
      <div className="bg-white p-6 rounded-2xl shadow max-w-3xl">
        <div><strong>Patient:</strong> #{pres.patientId}</div>
        <div><strong>Diagnosis:</strong> {pres.diagnosis}</div>
        <div className="mt-3">
          <strong>Medicines:</strong>
          <ul className="list-disc ml-6 mt-2">
            {pres.medicines.map((m:any, i:number) => <li key={i}>{m.name} — {m.dose} — {m.frequency} — {m.duration}</li>)}
          </ul>
        </div>
        <div className="mt-3"><strong>Notes:</strong> {pres.notes || "—"}</div>
      </div>
    </DoctorLayout>
  );
}
