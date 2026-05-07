import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatient } from "../../../services/patientService";
import DoctorLayout from "../../../layouts/DoctorLayout";
import { useAuth } from "../../../context/AuthContext";
import Vitals from "../../ehr/Vitals";
import MedicalRecords from "../../ehr/MedicalRecords";
import EhrTabs from "../../../components/ehr/EhrTabs";

export default function DoctorPatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);

  const { token } = useAuth();

  const getDoctorId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.sub;
    } catch {
      return null;
    }
  };

  const doctorId = getDoctorId();

  useEffect(() => {
    if (id) (async () => setPatient(await getPatient(Number(id))))();
  }, [id]);

  if (!patient) return (<DoctorLayout><div>Loading..</div></DoctorLayout>);

  return (
    <DoctorLayout>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
  
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{patient.name}</h2>
          <span className="text-sm text-gray-500">#{patient.id}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Email: {patient.email}</div>
          <div>Contact: {patient.contact}</div>
          <div>Gender: {patient.gender}</div>
          <div>DOB: {patient.dob?.split("T")[0]}</div>
        </div>

        <EhrTabs
          tabs={[
            {
              label: "Vitals",
              content: <Vitals patientId={patient.id} />
            },
            {
              label: "Medical Records",
              content: (
                <MedicalRecords
                  patientId={patient.id}
                  doctorId={doctorId}
                />
              )
            },
            {
              label: "History",
              content: <div className="text-gray-500">Coming soon...</div>
            }
          ]}
        />

      </div>
    </DoctorLayout>
  );
}
