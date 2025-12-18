import React, { useEffect, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getPatient } from "../../services/PatientService";
import { useParams } from "react-router-dom";

export default function DoctorPatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (id) (async () => setPatient(await getPatient(Number(id))))();
  }, [id]);

  if (!patient) return (<DoctorLayout><div>Loading...</div></DoctorLayout>);

  return (
    <DoctorLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Patient — {patient.name}</h1>
        <div className="bg-white p-6 rounded-2xl shadow max-w-2xl">
          <div><strong>ID:</strong> {patient.id}</div>
          <div><strong>Email:</strong> {patient.email}</div>
          <div><strong>DOB:</strong> {patient.dob?.split('T')[0]}</div>
          <div><strong>Gender:</strong> {patient.gender}</div>
          <div><strong>Contact:</strong> {patient.contact}</div>
          <div><strong>User ID:</strong> {patient.userId}</div>
        </div>
      </div>
    </DoctorLayout>
  );
}
