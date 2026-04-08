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
      <h1 className="text-2xl font-bold mb-4">New Prescription</h1>
      <div className="bg-white p-6 rounded-2xl shadow max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Patient ID</label>
            <input className="w-full px-3 py-2 border rounded" value={form.patientId} onChange={e=>setForm({...form, patientId:e.target.value})} required />
          </div>

          <div>
            <label className="block text-sm">Symptoms</label>
            <textarea className="w-full px-3 py-2 border rounded" value={form.symptoms} onChange={e=>setForm({...form, symptoms:e.target.value})} />
          </div>

          <div>
            <label className="block text-sm">Diagnosis</label>
            <textarea className="w-full px-3 py-2 border rounded" value={form.diagnosis} onChange={e=>setForm({...form, diagnosis:e.target.value})} />
          </div>

          <div>
            <label className="block text-sm mb-2">Medicines</label>
            <div className="space-y-2">
              {form.medicines.map((m, idx) => (
                <MedicineRow key={idx} idx={idx} item={m} onChange={(v)=>onMedicineChange(idx,v)} onRemove={()=>removeRow(idx)} />
              ))}
            </div>
            <div className="mt-2">
              <button type="button" onClick={addRow} className="px-3 py-2 border rounded">+ Add medicine</button>
            </div>
          </div>

          <div>
            <label className="block text-sm">Follow-up date</label>
            <input type="date" className="px-3 py-2 border rounded" value={form.followUpDate} onChange={e=>setForm({...form, followUpDate:e.target.value})} />
          </div>

          <div>
            <label className="block text-sm">Notes</label>
            <textarea className="w-full px-3 py-2 border rounded" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-primary text-white px-4 py-2 rounded">{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={()=>navigate("/doctor/prescriptions")} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </DoctorLayout>
  );
}
