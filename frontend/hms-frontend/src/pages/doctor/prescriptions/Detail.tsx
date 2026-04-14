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

  if (!pres)
    return (
      <DoctorLayout>
        <div className="animate-pulse h-40 bg-gray-200 rounded-xl" />
      </DoctorLayout>
    );

  return (
    <DoctorLayout>

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Prescription #{pres.id}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-4xl mx-auto space-y-6">

        {/* PATIENT INFO */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Patient Info</h2>
          <p className="text-gray-600">Patient ID: #{pres.patientId}</p>
        </div>

        {/* DIAGNOSIS */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Diagnosis</h2>
          <p className="text-gray-700">{pres.diagnosis}</p>
        </div>

        {/* MEDICINES */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Medicines</h2>

          <div className="space-y-3">
            {pres.medicines.map((m: any, i: number) => (
              <div
                key={i}
                className="border p-4 rounded-lg flex flex-col md:flex-row md:justify-between"
              >
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-gray-500">
                    Dose: {m.dose}
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  {m.frequency} • {m.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NOTES */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-gray-700">
            {pres.notes || "No additional notes"}
          </p>
        </div>

        {/* FOLLOW UP */}
        {pres.followUpDate && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Follow-up</h2>
            <p className="text-gray-700">
              {new Date(pres.followUpDate).toLocaleDateString()}
            </p>
          </div>
        )}

      </div>
    </DoctorLayout>
  );
}
