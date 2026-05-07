import { useState } from "react";
import { createVital } from "../../services/ehrService";

export default function AddVital({ patientId, onSaved }: any) {

  const [form, setForm] = useState<any>({});

  const handle = (k: string, v: any) =>
    setForm((prev: any) => ({ ...prev, [k]: v }));

  const submit = async () => {
    await createVital({ ...form, patientId });
    onSaved();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">

      <h3 className="font-semibold">Add Vitals</h3>

      <input placeholder="Temperature"
        onChange={e => handle("temperature", e.target.value)}
        className="border p-2 w-full" />

      <input placeholder="Heart Rate"
        onChange={e => handle("heartRate", e.target.value)}
        className="border p-2 w-full" />

      <input placeholder="BP (Systolic)"
        onChange={e => handle("systolicBp", e.target.value)}
        className="border p-2 w-full" />

      <input placeholder="BP (Diastolic)"
        onChange={e => handle("diastolicBp", e.target.value)}
        className="border p-2 w-full" />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>

    </div>
  );
}