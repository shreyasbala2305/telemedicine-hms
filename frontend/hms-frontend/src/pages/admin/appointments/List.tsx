// src/pages/admin/appointments/List.tsx
import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { getAppointments } from '../../../services/appointmentService';
import SearchBar from '../../../components/ui/SearchBar';
import FilterBar from '../../../components/ui/FilterBar';
import Pagination from '../../../components/ui/Pagination';
import Skeleton from '../../../components/ui/Skeleton';
import StatusBadge from '../../../components/ui/StatusBadge';
import { downloadCSV } from '../../../utils/csv';
import { Link } from 'react-router-dom';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let arr = appointments;
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(a => String(a.patientId).includes(q) || String(a.doctorId).includes(q) || (a.description||"").toLowerCase().includes(q));
    }
    if (status) arr = arr.filter(a => a.status === status);
    if (dateFrom) arr = arr.filter(a => new Date(a.appointmentDate) >= new Date(dateFrom));
    if (dateTo) arr = arr.filter(a => new Date(a.appointmentDate) <= new Date(dateTo));
    return arr;
  }, [appointments, query, status, dateFrom, dateTo]);

  const pageData = useMemo(() => {
    const start = (page-1)*pageSize;
    return filtered.slice(start, start+pageSize);
  }, [filtered, page]);

  const exportCSV = () => {
    downloadCSV('appointments.csv', filtered.map(a => ({ id: a.id, patientId: a.patientId, doctorId: a.doctorId, appointmentDate: a.appointmentDate, status: a.status })));
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div className="text-sm text-gray-500">Manage appointments</div>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by patient/doctor or notes" />
          <button onClick={exportCSV} className="px-3 py-2 border rounded bg-white">Export CSV</button>
          <Link to="/admin/appointments/new" className="bg-primary text-white px-4 py-2 rounded">+ New</Link>
        </div>
      </div>

      <div className="mb-4">
        <FilterBar status={status} onStatus={setStatus} dateFrom={dateFrom} dateTo={dateTo} onDateFrom={setDateFrom} onDateTo={setDateTo} />
      </div>

      <div className="bg-white rounded-2xl shadow table-responsive">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length: pageSize}).map((_,i)=>(
                <tr key={i}><td colSpan={6} className="p-4"><Skeleton className="h-6 w-full"/></td></tr>
              ))
            ) : pageData.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center">No appointments</td></tr>
            ) : pageData.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.id}</td>
                <td className="p-3">#{a.patientId}</td>
                <td className="p-3">#{a.doctorId}</td>
                <td className="p-3">{new Date(a.appointmentDate).toLocaleString()}</td>
                <td className="p-3"><StatusBadge status={a.status} /></td>
                <td className="p-3">
                  <Link to={`/admin/appointments/${a.id}`} className="text-blue-600 mr-4">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination page={page} pageSize={pageSize} total={filtered.length} onPage={setPage} />
      </div>
    </DashboardLayout>
  );
}
