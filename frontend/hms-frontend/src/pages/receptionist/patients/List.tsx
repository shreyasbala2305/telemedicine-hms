import { useEffect, useState } from "react";
import { getPatientsPaged } from "../../../services/patientService";
import { Link } from "react-router-dom";
import ReceptionistLayout from "../../../layouts/ReceptionistLayout";

export default function ReceptionistPatientsList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getPatientsPaged({ page: 1, pageSize: 20 });
    setPatients(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ReceptionistLayout>

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>

        <Link
          to="/receptionist/patients/new"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + Add Patient
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6">Loading...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center">No patients</td></tr>
            ) : (
              patients.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.contact}</td>

                  <td className="p-3">
                    <Link
                      to={`/receptionist/patients/${p.id}`}
                      className="text-blue-600"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </ReceptionistLayout>
  );
}