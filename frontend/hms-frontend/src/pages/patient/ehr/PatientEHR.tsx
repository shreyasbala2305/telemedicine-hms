import React from "react";
import PatientLayout from "../../../layouts/PatientLayout";

export default function PatientEHR() {
  return (
    <PatientLayout>
      <h1 className="text-2xl font-bold mb-6">Health Records</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["BP", "Sugar", "Hb", "Weight"].map(label => (
          <div key={label} className="bg-white p-4 rounded-2xl shadow">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-xl font-bold">--</div>
          </div>
        ))}
      </div>

      {/* RECORDS */}
      <div className="mt-6 bg-white p-5 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Medical Records</h2>
        <div className="text-gray-500">No records uploaded yet</div>
      </div>
    </PatientLayout>
  );
}