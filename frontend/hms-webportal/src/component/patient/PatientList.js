import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    api.get('/patients')
      .then(res => setPatients(res.data))
      .catch(err => console.error('Failed to fetch patients', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Patient List</h2>
      <table className="table-auto w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id} className="text-center border-t">
              <td className="px-4 py-2">{patient.id}</td>
              <td className="px-4 py-2">{patient.name}</td>
              <td className="px-4 py-2">{patient.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientList;
