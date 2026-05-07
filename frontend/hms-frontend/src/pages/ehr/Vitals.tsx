import { useEffect, useState } from "react";
import AddVital from "./AddVital";
import { getVitals } from "../../services/ehrService";

export default function Vitals({ patientId }: any) {

  const [vitals, setVitals] = useState<any[]>([]);

  const load = async () => {
    const data = await getVitals(patientId);
    setVitals(data || []);
  };

  useEffect(() => {
    load();
  }, [patientId]);

  return (
    <div>

      <AddVital patientId={patientId} onSaved={load} />

      <div className="mt-6 space-y-3">

        {vitals.map(v => (
          <div key={v.id} className="bg-gray-100 p-4 rounded-lg">

            <div className="text-sm text-gray-500">
              {new Date(v.recordedAt).toLocaleString()}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Temp: {v.temperature}</div>
              <div>HR: {v.heartRate}</div>
              <div>BP: {v.systolicBp}/{v.diastolicBp}</div>
              <div>Weight: {v.weight}</div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}