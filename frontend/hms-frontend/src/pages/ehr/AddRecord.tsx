import { useState } from "react";
import toast from "react-hot-toast";
import { createRecord } from "../../services/ehrService";

export default function AddRecord({ patientId, doctorId, appointmentId, onSaved }: any) {

  const [form, setForm] = useState({
    diagnosis: "",
    notes: "",
    prescription: "",
  });

  const handle = (k: string, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const submit = async () => {
    try {
      await createRecord({
        ...form,
        patientId,
        doctorId,
        appointmentId,
      });

      toast.success("Record saved");
      onSaved();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">

      <h3 className="font-semibold">Add Medical Record</h3>

      <input
        placeholder="Diagnosis (e.g. Viral fever)"
        value={form.diagnosis}
        onChange={e => handle("diagnosis", e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Doctor Notes (symptoms, observations)"
        value={form.notes}
        onChange={e => handle("notes", e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Prescription (medicines, dosage)"
        value={form.prescription}
        onChange={e => handle("prescription", e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Record
      </button>

    </div>
  );
}