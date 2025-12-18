import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }: { value: string; onChange: (v:string)=>void; placeholder?: string }) {
  return (
    <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm w-full max-w-xl">
      <Search size={16} className="text-gray-400 mr-2" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none text-sm text-gray-700"
      />
      {value && <button onClick={() => onChange("")} className="text-sm text-gray-400 ml-2">Clear</button>}
    </div>
  );
}
