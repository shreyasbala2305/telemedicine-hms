import React from "react";

export default function StatsCard({ title, value, subtitle, icon }: { title:string; value:string|number; subtitle?:string; icon?:React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow card-hover animate-fadeInUp">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
        </div>
        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-700">
          {icon}
        </div>
      </div>
    </div>
  );
}
