import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getAppointmentsPaged } from "../../../services/appointmentService";
import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import Pagination from "../../../components/ui/Pagination";
import Skeleton from "../../../components/ui/Skeleton";
import StatusBadge from "../../../components/ui/StatusBadge";
import { getPatientsByIds } from "../../../services/patientService";
import { getDoctors } from "../../../services/doctorService";
import { downloadCSV } from "../../../utils/csv";
import { Link } from "react-router-dom";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [patientMap, setPatientMap] = useState<Record<number, string>>({});
  const [doctorMap, setDoctorMap] = useState<Record<number, string>>({});
  const [filters, setFilters] = useState({
  status: "",
  dateFrom: "",
  dateTo: "",
});

const appointmentFilters = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "CONFIRMED", value: "CONFIRMED" },
      { label: "SCHEDULED", value: "SCHEDULED" },
      { label: "COMPLETED", value: "COMPLETED" },
      { label: "CANCELLED", value: "CANCELLED" },
    ],
  },
  { key: "dateFrom", label: "From", type: "date" as const },
  { key: "dateTo", label: "To", type: "date" as const },
];

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getAppointmentsPaged({
          page: page - 1,
          pageSize,
          search: query,
          status: filters.status,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        });

        const list = data.content || [];

        setAppointments(list);
        setTotalAppointments(data.totalElements || 0);

        // ✅ Extract IDs
        const patientIds = [...new Set(list.map((a: any) => a.patientId))] as (number | string)[];
        const doctorIds = [...new Set(list.map((a: any) => a.doctorId))] as (number | string)[];

        // ✅ Fetch patients
        const patients = await getPatientsByIds(patientIds);
        const pMap: Record<number, string> = {};
        patients.forEach((p: any) => {
          pMap[p.id] = p.name;
        });
        setPatientMap(pMap);

        // ✅ Fetch doctors
        const doctors = await getDoctors();
        const dMap: Record<number, string> = {};
        doctors.forEach((d: any) => {
          dMap[d.id] = d.name;
        });
        setDoctorMap(dMap);

      } catch (err) {
        console.error("Failed to load appointments", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, query, filters]);

  // ✅ CSV EXPORT
  const exportCSV = () => {
    downloadCSV(
      "appointments.csv",
      appointments.map((a) => ({
        id: a.id,
        patient: patientMap[a.patientId] || a.patientId,
        doctor: doctorMap[a.doctorId] || a.doctorId,
        dateTime: a.dateTime,
        status: a.status,
      }))
    );
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div className="text-sm text-gray-500">Manage appointments</div>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search..."
          />

          <button
            onClick={exportCSV}
            className="px-3 py-2 border rounded bg-white dark:bg-gray-800"
          >
            Export CSV
          </button>

          <Link
            to="/admin/appointments/new"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            + New
          </Link>
        </div>
      </div>

      {/* FILTER */}
      <div className="mb-4">
        <FilterBar
          filters={appointmentFilters}
          values={filters}
          onChange={(key, value) =>
            setFilters((prev) => ({ ...prev, [key]: value }))
          }
        />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
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
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="p-4">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  No appointments
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.id}</td>

                  <td className="p-3">
                    {patientMap[a.patientId] || `#${a.patientId}`}
                  </td>

                  <td className="p-3">
                    {doctorMap[a.doctorId] || `#${a.doctorId}`}
                  </td>

                  <td className="p-3">
                    {a.dateTime
                      ? new Date(a.dateTime).toLocaleString()
                      : "—"}
                  </td>

                  <td className="p-3">
                    <StatusBadge status={a.status} />
                  </td>

                  <td className="p-3">
                    <Link
                      to={`/admin/appointments/${a.id}`}
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

        {/* PAGINATION */}
        <Pagination
          page={page}
          pageSize={pageSize}
          total={totalAppointments}
          onPage={setPage}
        />
      </div>
    </DashboardLayout>
  );
}