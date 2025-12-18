// src/components/ui/StatusBadge.tsx
import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-800',
    SCHEDULED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-800';
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
}
