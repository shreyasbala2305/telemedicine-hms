import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<{id:number; message:string; time:string}[]>([]);

  useEffect(()=> {
    setNotes([
      { id: 1, message: "New appointment created — John Doe", time: "2m ago" },
      { id: 2, message: "Patient registered — Jane Smith", time: "10m ago" },
    ]);
  }, []);

  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="p-2 rounded-lg bg-white/10"><Bell size={18} /></button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b">Notifications</div>
          <div className="max-h-56 overflow-y-auto">
            {notes.map(n => (
              <div key={n.id} className="p-3 border-b text-sm">
                <div>{n.message}</div>
                <div className="text-xs text-gray-500 mt-1">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
