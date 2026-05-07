import { useState } from "react";

export default function EhrTabs({ tabs }: any) {
  const [active, setActive] = useState(0);

  return (
    <div>

      {/* TAB HEADERS */}
      <div className="flex gap-2 border-b mb-4">
        {tabs.map((t: any, i: number) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium ${
              active === i
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div>
        {tabs[active].content}
      </div>

    </div>
  );
}