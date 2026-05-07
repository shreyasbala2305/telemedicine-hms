import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import { getPatient } from "../../../services/patientService";
import Vitals from "../../ehr/Vitals";
import ReceptionistLayout from "../../../layouts/ReceptionistLayout";

export default function ReceptionistPatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await getPatient(Number(id));
      setPatient(data);
    })();
  }, [id]);

  if (!patient) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <ReceptionistLayout>

      <h1 className="text-2xl font-bold mb-6">
        {patient.name}
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-xl space-y-3">

        <div><b>Email:</b> {patient.email}</div>
        <div><b>Contact:</b> {patient.contact}</div>
        <div><b>Gender:</b> {patient.gender}</div>
        <div><b>DOB:</b> {patient.dob?.split("T")[0]}</div>
        <Vitals patientId={patient.id} />

      </div>

    </ReceptionistLayout>
  );
}