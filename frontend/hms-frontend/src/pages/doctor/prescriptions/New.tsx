// src/pages/doctor/prescriptions/New.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { createPrescription } from "../../../services/prescriptionService";
import DoctorLayout from "../../../layouts/DoctorLayout";
import MedicineRow from "../../../components/ui/MedicineRow";

export default function NewPrescription() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const appointmentIdParam = search.get("appointment");
  const { token } = useAuth();

  const getDoctorIdFromToken = () => {
    if (!token) return null;
    try { const p = JSON.parse(atob(token.split(".")[1])); return p.sub || p.id || p.doctorId || null; } catch { return null; }
  };

  const [form, setForm] = useState({
    appointmentId: appointmentIdParam ? Number(appointmentIdParam) : undefined,
    patientId: "",
    symptoms: "",
    diagnosis: "",
    medicines: [{ name: "", dose: "", frequency: "", duration: "" }],
    followUpDate: "",
    notes: ""
  });
  const [saving, setSaving] = useState(false);

  const onMedicineChange = (idx:number, v:any) => {
    const copy = [...form.medicines];
    copy[idx] = v;
    setForm({...form, medicines: copy});
  };
  const addRow = () => setForm({...form, medicines: [...form.medicines, { name: "", dose: "", frequency: "", duration: "" }]});
  const removeRow = (idx:number) => setForm({...form, medicines: form.medicines.filter((_,i)=>i!==idx)});

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        appointmentId: form.appointmentId,
        patientId: Number(form.patientId),
        doctorId: getDoctorIdFromToken(),
        symptoms: form.symptoms,
        diagnosis: form.diagnosis,
        medicines: form.medicines.filter(m=>m.name),
        followUpDate: form.followUpDate || undefined,
        notes: form.notes
      };
      await createPrescription(payload);
      toast.success("Prescription saved");
      navigate("/doctor/prescriptions");
    } catch {
      toast.error("Save failed");
    } finally { setSaving(false); }
  };

  return (
    <DoctorLayout>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Prescription 💊</h1>
        <p className="text-gray-500 text-sm">
          Add diagnosis and medicines for the patient
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-4xl">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PATIENT INFO */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Patient Info</h2>

            <input
              placeholder="Enter Patient ID"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.patientId}
              onChange={e => setForm({ ...form, patientId: e.target.value })}
              required
            />
          </div>

          {/* SYMPTOMS */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Symptoms</h2>

            <textarea
              placeholder="Enter symptoms..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.symptoms}
              onChange={e => setForm({ ...form, symptoms: e.target.value })}
            />
          </div>

          {/* DIAGNOSIS */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Diagnosis</h2>

            <textarea
              placeholder="Enter diagnosis..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.diagnosis}
              onChange={e => setForm({ ...form, diagnosis: e.target.value })}
              required
            />
          </div>

          {/* MEDICINES */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Medicines</h2>

              <button
                type="button"
                onClick={addRow}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {form.medicines.map((m, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <MedicineRow
                    idx={idx}
                    item={m}
                    onChange={(v) => onMedicineChange(idx, v)}
                    onRemove={() => removeRow(idx)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FOLLOW UP */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Follow-up</h2>

            <input
              type="date"
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.followUpDate}
              onChange={e => setForm({ ...form, followUpDate: e.target.value })}
            />
          </div>

          {/* NOTES */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Notes</h2>

            <textarea
              placeholder="Additional notes..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">

            <button
              type="submit"
              disabled={saving}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Prescription"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/doctor/prescriptions")}
              className="px-6 py-3 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </DoctorLayout>
  );
}
