import React from "react";

type FilterOption = {
  label: string;
  value: string;
};

type FilterConfig = {
  key: string;
  label: string;
  type: "select" | "date" | "text";
  options?: FilterOption[];
};

export default function FilterBar({
  filters,
  values,
  onChange,
  extra
}: {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">

      {filters.map((f) => {
        if (f.type === "select") {
          return (
            <select
              key={f.key}
              value={values[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800"
            >
              <option value="">{f.label}</option>
              {f.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }

        if (f.type === "date") {
          return (
            <div key={f.key} className="flex items-center gap-2">
              <label className="text-xs text-gray-500">{f.label}</label>
              <input
                type="date"
                value={values[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                className="px-2 py-2 border rounded-lg text-sm dark:bg-gray-800"
              />
            </div>
          );
        }

        return (
          <input
            key={f.key}
            placeholder={f.label}
            value={values[f.key] || ""}
            onChange={(e) => onChange(f.key, e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        );
      })}

      {extra}
    </div>
  );
}