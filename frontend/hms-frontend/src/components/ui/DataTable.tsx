import React from "react";

export default function DataTable({ columns, data, loading }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-white-100 overflow-hidden">

      <table className="min-w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((col: any) => (
              <th key={col.key} className="p-3 text-left text-sm font-medium text-gray-600">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-t animate-pulse">
                {Array(4).fill(0).map((_, j) => (
                  <td key={j} className="p-3">
                    <div className="h-3 w-full max-w-[150px] bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row: any, i: number) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                {columns.map((col: any) => (
                  <td key={col.key} className="p-3 text-sm">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}