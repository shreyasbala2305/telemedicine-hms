import React from "react";

export default function Input({ value, onChange, placeholder, type = "text" }: { value?: string; onChange?: (v:string)=>void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={(e)=>onChange?.(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />;
}
