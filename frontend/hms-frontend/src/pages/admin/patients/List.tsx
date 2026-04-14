import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import SearchBar from "../../../components/ui/SearchBar";
import Pagination from "../../../components/ui/Pagination";
import { getPatientsPaged } from "../../../services/patientService";
import useDebounce from "../../../hooks/useDebounce";
import { Link } from "react-router-dom";

export default function PatientsList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedQuery = useDebounce(query, 400);

  const load = async () => {
    setLoading(true);
    const data = await getPatientsPaged({
      search: debouncedQuery,
      page,
      pageSize,
    });
    setPatients(data.data || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [debouncedQuery, page]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Link to="/admin/patients/new" className="bg-primary text-white px-4 py-2 rounded">
          + Add
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search patients..." />
      </div>

      <div className="bg-white rounded-xl dark:bg-gray-800 shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  {Array(5).fill(0).map((_, j) => (
                    <td key={j} className="p-2">
                      <div className="h-3 w-full max-w-[150px] bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : patients.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center">No patients found</td></tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3"><Link to={`/admin/patients/${p.id}`} className="text-teal-900">{p.name}</Link></td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.contact}</td>
                  <td className="p-3">
                    <Link to={`/admin/patients/${p.id}/edit`} className="text-blue-600 mr-4">Edit</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPage={setPage}
        />
      </div>
    </DashboardLayout>
  );
}
