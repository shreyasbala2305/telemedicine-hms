// src/pages/admin/doctors/List.tsx
import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { getDoctors, deleteDoctor, Doctor } from '../../../services/doctorService';
import { Link } from 'react-router-dom';
import FilterBar from '../../../components/ui/FilterBar';
import Pagination from '../../../components/ui/Pagination';
import Skeleton from '../../../components/ui/Skeleton';
import { downloadCSV } from '../../../utils/csv';

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    speciality: "",
    search: "",
  });
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    try { const data = await getDoctors(); setDoctors(data || []); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const matchSearch = filters.search
        ? d.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          d.email?.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchSpeciality = filters.speciality
        ? d.speciality === filters.speciality
        : true;

      return matchSearch && matchSpeciality;
    });
  }, [doctors, filters]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [filteredDoctors, page]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('Delete this doctor?')) return;
    await deleteDoctor(id);
    load();
  };

  const exportCSV = () => {
    downloadCSV('doctors.csv', filteredDoctors.map(d => ({ id: d.id, name: d.name, email: d.email, speciality: d.speciality, contact: d.contact })));
  };

  const doctorFilters = [
    {
      key: "search",
      label: "Search doctor",
      type: "text" as const,
    },
    {
      key: "speciality",
      label: "All Specialities",
      type: "select" as const,
      options: [
        { label: "Cardiology", value: "Cardiology" },
        { label: "Orthopedic", value: "Orthopedic" },
        { label: "Dermatologist", value: "Dermatologist" },
        { label: "Pediatrician", value: "Pediatrician" },
        { label: "General", value: "General" },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Doctors</h1>
          <div className="text-sm text-gray-500">Manage doctors</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="px-3 py-2 border rounded bg-white dark:bg-gray-800">Export CSV</button>
          <Link to="/admin/doctors/new" className="bg-primary text-white px-4 py-2 rounded">+ Add</Link>
        </div>
      </div>

      <div className="mb-4">
        <FilterBar
            filters={doctorFilters}
            values={filters}
            onChange={(key, value) =>
              setFilters((prev) => ({ ...prev, [key]: value }))
            }
          />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow table-responsive">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Speciality</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length: pageSize}).map((_,i)=>(
                <tr key={i}><td colSpan={6} className="p-4"><Skeleton className="h-6 w-full"/></td></tr>
              ))
            ) : pageData.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center">No doctors</td></tr>
            ) : pageData.map(d => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{d.id}</td>
                <td className="p-3"><Link to={`/admin/doctors/${d.id}`}>{d.name}</Link></td>
                <td className="p-3">{d.speciality}</td>
                <td className="p-3">{d.email}</td>
                <td className="p-3">{d.contact}</td>
                <td className="p-3">
                  <Link to={`/admin/doctors/${d.id}/edit`} className="text-blue-600 mr-4">Edit</Link>
                  <button onClick={() => handleDelete(d.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={filteredDoctors.length}
          onPage={setPage}
        />
      </div>
    </DashboardLayout>
  );
}
