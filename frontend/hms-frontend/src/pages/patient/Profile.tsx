import React, { useEffect, useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import { getPatients } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

export default function PatientProfile() {
  const { token } = useAuth();
  const [patient, setPatient] = useState<any | null>(null);

  const getUserIdFromToken = () => {
    if (!token) return null;
    try { const payload = JSON.parse(atob(token.split(".")[1])); return payload.sub || payload.userId || payload.id || null; } catch { return null; }
  };

  useEffect(() => {
    (async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      // patient endpoints use numeric ID; if token holds userId mapping differs adjust accordingly
      const all = await getPatients();
      const me = all.find((p:any) => String(p.userId) === String(userId) || String(p.id) === String(userId));
      setPatient(me || null);
    })();
  }, [token]);

  if (!patient) return <PatientLayout><div>Loading profile...</div></PatientLayout>;

  return (
    <PatientLayout>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded-2xl shadow max-w-2xl">
        <div><strong>Name:</strong> {patient.name}</div>
        <div><strong>Email:</strong> {patient.email}</div>
        <div><strong>DOB:</strong> {patient.dob?.split('T')[0]}</div>
        <div><strong>Gender:</strong> {patient.gender}</div>
        <div><strong>Contact:</strong> {patient.contact}</div>
        <div><strong>User ID:</strong> {patient.userId}</div>
      </div>
    </PatientLayout>
  );
}
