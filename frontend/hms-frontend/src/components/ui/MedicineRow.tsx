// src/components/ui/MedicineRow.tsx
import React from "react";

export default function MedicineRow({ idx, item, onChange, onRemove }: { idx:number; item:any; onChange:(v:any)=>void; onRemove:()=>void }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <input className="col-span-4 px-2 py-2 border rounded" placeholder="Medicine name" value={item.name} onChange={e=>onChange({...item, name:e.target.value})}/>
      <input className="col-span-2 px-2 py-2 border rounded" placeholder="Dose" value={item.dose} onChange={e=>onChange({...item, dose:e.target.value})}/>
      <input className="col-span-3 px-2 py-2 border rounded" placeholder="Frequency" value={item.frequency} onChange={e=>onChange({...item, frequency:e.target.value})}/>
      <input className="col-span-2 px-2 py-2 border rounded" placeholder="Duration" value={item.duration} onChange={e=>onChange({...item, duration:e.target.value})}/>
      <button type="button" onClick={onRemove} className="col-span-1 text-red-600">Remove</button>
    </div>
  );
}
