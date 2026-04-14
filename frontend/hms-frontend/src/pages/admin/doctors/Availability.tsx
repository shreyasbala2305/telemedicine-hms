// src/pages/admin/doctors/Availability.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getSavedAvailability, saveAvailability } from "../../../services/availabilityService";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminDoctorAvailability() {
  const navigate = useNavigate();
  const { id, name } = useParams<{ id: string, name: string }>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({ startTime: "09:00", endTime: "17:00", slotMinutes: 30, weekdays: [1,2,3,4,5], breaks: [] });

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      const saved = await getSavedAvailability(Number(id));
      if (saved) setForm(saved);
      setLoading(false);
    })();
  }, [id]);

  const toggleWeekday = (n:number) => {
    const set = new Set(form.weekdays || []);
    if (set.has(n)) set.delete(n); else set.add(n);
    setForm({...form, weekdays: Array.from(set).sort()});
  };

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    if (form.startTime >= form.endTime) {
      toast.error("Start time must be before end time");
      return;
    }
    try {
      await saveAvailability(Number(id), form);
      toast.success("Availability saved");
    } catch {
      toast.error("Save failed");
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Doctor Availability — {name}</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-3xl">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm">Start time</label>
            <input value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})} type="time" className="px-3 py-2 dark:bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block text-sm">End time</label>
            <input value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})} type="time" className="px-3 py-2 dark:bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Slot minutes</label>
            <select value={form.slotMinutes} onChange={e=>setForm({...form, slotMinutes: Number(e.target.value)})} className="px-3 py-2 dark:bg-gray-800 border rounded">
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Weekdays</label>
            <div className="flex gap-2 mt-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i) => (
                <button type="button" key={i} onClick={()=>toggleWeekday(i)} className={`px-2 py-1 rounded-full text-sm border transition 
                  ${(form.weekdays || []).includes(i)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}>{d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-2">Breaks</label>

          {(form.breaks || []).map((b:any, idx:number) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input type="time"
                value={b.start}
                onChange={e=>{
                  const copy=[...form.breaks];
                  copy[idx].start=e.target.value;
                  setForm({...form, breaks:copy});
                }}
                className="border px-2 py-1 rounded"
              />
              <input type="time"
                value={b.end}
                onChange={e=>{
                  const copy=[...form.breaks];
                  copy[idx].end=e.target.value;
                  setForm({...form, breaks:copy});
                }}
                className="border px-2 py-1 rounded"
              />
              <button onClick={()=>{
                setForm({...form, breaks:form.breaks.filter((_:any,i:number)=>i!==idx)})
              }}>❌</button>
            </div>
          ))}

          <button
            onClick={() =>
              setForm({
                ...form,
                breaks: [...(form.breaks || []), { start: "", end: "" }],
              })
            }
            className="px-3 py-1 border rounded"
          >
            + Add Break
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded">Save Availability</button>
          <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate(`/admin/doctors/${id}/edit`)}>Cancel</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
