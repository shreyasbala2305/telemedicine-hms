// src/components/ui/SlotButton.tsx
import React from "react";

export default function SlotButton({ time, disabled, selected, onClick }: { time:string; disabled?:boolean; selected?:boolean; onClick?:()=>void }) {
  const base = "px-3 py-2 rounded-lg border text-sm";
  const cls = disabled ? "bg-gray-100 text-gray-400 border-gray-200" : selected ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-200 hover:shadow-sm";
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${cls}`}>
      {time}
    </button>
  );
}
