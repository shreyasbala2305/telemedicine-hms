import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getPatient } from "../../../services/patientService";

export default function AdminPatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (id) (async () => setPatient(await getPatient(Number(id))))();
  }, [id]);

  if (!patient) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {patient.name}
          </h1>
          <p className="text-sm text-gray-500">Patient Details</p>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 grid grid-cols-2 gap-6">

          <div>
            <p className="text-xs text-gray-500">Patient ID</p>
            <p className="font-semibold">{patient.id}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-semibold">{patient.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Contact</p>
            <p className="font-semibold">{patient.contact}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <p className="font-semibold">{patient.gender}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">DOB</p>
            <p className="font-semibold">
              {patient.dob?.split("T")[0]}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">User ID</p>
            <p className="font-semibold">{patient.userId || "—"}</p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}