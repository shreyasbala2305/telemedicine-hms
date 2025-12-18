import React from "react";

export default function FilterBar({
  status,
  onStatus,
  dateFrom,
  dateTo,
  onDateFrom,
  onDateTo,
  extra
}: {
  status?: string;
  onStatus?: (s:string)=>void;
  dateFrom?: string;
  dateTo?: string;
  onDateFrom?: (s:string)=>void;
  onDateTo?: (s:string)=>void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select value={status||""} onChange={e => onStatus?.(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white">
        <option value="">All status</option>
        <option>CONFIRMED</option>
        <option>SCHEDULED</option>
        <option>COMPLETED</option>
        <option>CANCELLED</option>
      </select>

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">From</label>
        <input type="date" value={dateFrom||""} onChange={e => onDateFrom?.(e.target.value)} className="px-2 py-2 border rounded-lg text-sm" />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">To</label>
        <input type="date" value={dateTo||""} onChange={e => onDateTo?.(e.target.value)} className="px-2 py-2 border rounded-lg text-sm" />
      </div>

      {extra}
    </div>
  );
}
