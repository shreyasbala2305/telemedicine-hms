// src/utils/csv.ts
export function downloadCSV(filename: string, rows: any[], columns?: string[]) {
  if (!rows || rows.length === 0) {
    return;
  }
  const keys = columns && columns.length ? columns : Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => {
        const v = r[k];
        if (v === null || v === undefined) return "";
        const s = typeof v === "string" ? v : String(v);
        // escape
        return `"${s.replace(/"/g, '""')}"`;
      }).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
