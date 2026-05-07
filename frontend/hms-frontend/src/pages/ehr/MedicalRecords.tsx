import { useEffect, useState } from "react";
import AddRecord from "./AddRecord";
import { getRecords } from "../../services/ehrService";

export default function MedicalRecords({ patientId, doctorId }: any) {

  const [records, setRecords] = useState<any[]>([]);

  const load = async () => {
    const data = await getRecords(patientId);
    setRecords(data || []);
  };

  useEffect(() => {
    load();
  }, [patientId]);

  return (
    <div>

      <AddRecord
        patientId={patientId}
        doctorId={doctorId}
        onSaved={load}
      />

      <div className="mt-6 space-y-4">

        {records.map(r => (
          <div key={r.id} className="bg-gray-100 p-4 rounded-lg">

            <div className="text-xs text-gray-500 mb-2">
              {new Date(r.createdAt).toLocaleString()}
            </div>

            <div className="font-semibold">
              Diagnosis: {r.diagnosis}
            </div>

            <div className="text-sm mt-2">
              Notes: {r.notes}
            </div>

            <div className="text-sm mt-2">
              Prescription: {r.prescription}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}