// import React, { useEffect, useMemo, useState } from 'react';
// import DashboardLayout from '../../../layouts/DashboardLayout';
// import { getPatients, deletePatient, Patient } from '../../../services/patientService';
// import { Link } from 'react-router-dom';
// import SearchBar from '../../../components/ui/SearchBar';
// import FilterBar from '../../../components/ui/FilterBar';
// import Pagination from '../../../components/ui/Pagination';

// export default function PatientsList() {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [status, setStatus] = useState<string>("");
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await getPatients();
//       setPatients(data || []);
//     } finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const filtered = useMemo(() => {
//     let arr = patients;
//     if (query) {
//       const q = query.toLowerCase();
//       arr = arr.filter(p => String(p.name).toLowerCase().includes(q) || String(p.email).toLowerCase().includes(q) || String(p.contact||"").includes(q));
//     }
//     // placeholder for status filter if patient had status; we keep for uniformity
//     if (status) {
//       // arr = arr.filter(...)
//     }
//     return arr;
//   }, [patients, query, status]);

//   const pageData = useMemo(() => {
//     const start = (page-1)*pageSize;
//     return filtered.slice(start, start+pageSize);
//   }, [filtered, page]);

//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     if (!confirm('Delete this patient?')) return;
//     await deletePatient(id);
//     load();
//   };

//   return (
//     <DashboardLayout>
//       <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">Patients</h1>
//           <div className="text-sm text-gray-500">Manage registered patients</div>
//         </div>

//         <div className="flex items-center gap-3">
//           <SearchBar value={query} onChange={setQuery} placeholder="Search patients by name, email or contact" />
//           <Link to="/admin/patients/new" className="bg-primary text-white px-4 py-2 rounded">+ Add</Link>
//         </div>
//       </div>

//       <div className="mb-4">
//         <FilterBar status={status} onStatus={setStatus} />
//       </div>

//       <div className="bg-white rounded-2xl shadow table-responsive">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="p-3 text-left">ID</th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">DOB</th>
//               <th className="p-3 text-left">Contact</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
//             ) : pageData.length === 0 ? (
//               <tr><td colSpan={6} className="p-6 text-center">No patients</td></tr>
//             ) : pageData.map(p => (
//               <tr key={p.id} className="border-t">
//                 <td className="p-3">{p.id}</td>
//                 <td className="p-3">{p.name}</td>
//                 <td className="p-3">{p.email}</td>
//                 <td className="p-3">{p.dob?.split('T')[0]}</td>
//                 <td className="p-3">{p.contact}</td>
//                 <td className="p-3">
//                   <Link to={`/admin/patients/${p.id}/edit`} className="text-blue-600 mr-4">Edit</Link>
//                   <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <Pagination page={page} pageSize={pageSize} total={filtered.length} onPage={setPage} />
//       </div>
//     </DashboardLayout>
//   );
// }
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

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
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
                  <td className="p-3">{p.name}</td>
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
