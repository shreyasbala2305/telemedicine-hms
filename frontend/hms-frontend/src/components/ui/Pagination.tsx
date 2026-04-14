import React from "react";

export default function Pagination({
  page,
  pageSize,
  total,
  onPage
}: { page:number; pageSize:number; total:number; onPage:(p:number)=>void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const prev = () => onPage(Math.max(1, page-1));
  const next = () => onPage(Math.min(pages, page+1));
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <div className="text-gray-600">Showing <span className="font-medium">{(page-1)*pageSize+1}</span> - <span className="font-medium">{Math.min(page*pageSize, total)}</span> of <span className="font-medium">{total}</span></div>
      <div className="flex items-center gap-2">
        <button onClick={prev} disabled={page<=1} className="px-3 py-1 dark:bg-gray-800 border rounded disabled:opacity-50">Prev</button>
        <div className="px-3 py-1 dark:bg-gray-800 border rounded bg-white">{page} / {pages}</div>
        <button onClick={next} disabled={page>=pages} className="px-3 py-1 dark:bg-gray-800 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
