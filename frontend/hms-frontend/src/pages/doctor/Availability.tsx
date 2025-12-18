// src/pages/doctor/Availability.tsx
import React, { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getSavedAvailability, saveAvailability } from "../../services/availabilityService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function DoctorAvailability() {
  const { token } = useAuth();
  const [form, setForm] = useState<any>({ startTime: "09:00", endTime: "17:00", slotMinutes: 30, weekdays: [1,2,3,4,5] });
  const [loading, setLoading] = useState(false);

  const getDoctorIdFromToken = () => {
    if (!token) return null;
    try { const p = JSON.parse(atob(token.split(".")[1])); return p.sub || p.id || p.doctorId || null; } catch { return null; }
  };

  useEffect(() => {
    (async () => {
      const id = getDoctorIdFromToken();
      if (!id) return;
      setLoading(true);
      const saved = await getSavedAvailability(id);
      if (saved) setForm(saved);
      setLoading(false);
    })();
  }, [token]);

  const toggleWeekday = (n:number) => {
    const set = new Set(form.weekdays || []);
    if (set.has(n)) set.delete(n); else set.add(n);
    setForm({...form, weekdays: Array.from(set).sort()});
  };

  const handleSave = async () => {
    const id = getDoctorIdFromToken();
    if (!id) { toast.error("Doctor id missing"); return; }
    setLoading(true);
    try {
      await saveAvailability(id, form);
      toast.success("Saved");
    } catch {
      toast.error("Save failed");
    } finally { setLoading(false); }
  };

  return (
    <DoctorLayout>
      <h1 className="text-2xl font-bold mb-4">My Availability</h1>
      <div className="bg-white p-6 rounded-2xl shadow max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Start time</label>
            <input value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})} type="time" className="px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">End time</label>
            <input value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})} type="time" className="px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Slot minutes</label>
            <select value={form.slotMinutes} onChange={e=>setForm({...form, slotMinutes: Number(e.target.value)})} className="px-3 py-2 border rounded">
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Weekdays</label>
            <div className="flex gap-2 mt-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i) => (
                <button type="button" key={i} onClick={()=>toggleWeekday(i)} className={`px-3 py-1 border rounded ${ (form.weekdays||[]).includes(i) ? "bg-primary text-white":"bg-white" }`}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded">Save Availability</button>
        </div>
      </div>
    </DoctorLayout>
  );
}
