// src/components/ui/MobileSidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function MobileSidebar({ open, onClose, children }: { open: boolean; onClose: ()=>void; children?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative w-72 bg-sidebar text-white p-5">
        <button onClick={onClose} className="absolute right-3 top-3 p-1"><X /></button>
        {children}
      </aside>
    </div>
  );
}
