// src/pages/receptionist/appointments/List.tsx

import { useEffect, useState } from "react";
import {
  getAppointmentsPaged,
  updateAppointmentStatus
} from "../../../services/appointmentService";

import SearchBar from "../../../components/ui/SearchBar";
import FilterBar from "../../../components/ui/FilterBar";
import Pagination from "../../../components/ui/Pagination";
import Skeleton from "../../../components/ui/Skeleton";
import StatusBadge from "../../../components/ui/StatusBadge";

import { getPatientsByIds } from "../../../services/patientService";
import { getDoctors } from "../../../services/doctorService";

import toast from "react-hot-toast";
import ReceptionistLayout from "../../../layouts/ReceptionistLayout";

export default function ReceptionistAppointments() {

  const [appointments, setAppointments] = useState<any[]>([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  // 🔥 SORTING
  const [sortField, setSortField] = useState<
    "patient" | "doctor" | "date"
  >("date");

  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc"
  >("desc");

  // 🔥 MAPS
  const [patientMap, setPatientMap] = useState<Record<number, string>>({});
  const [doctorMap, setDoctorMap] = useState<Record<number, string>>({});

  // 🔥 FILTER OPTIONS
  const appointmentFilters = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "PENDING", value: "PENDING" },
        { label: "CONFIRMED", value: "CONFIRMED" },
        { label: "COMPLETED", value: "COMPLETED" },
        { label: "CANCELLED", value: "CANCELLED" },
      ],
    },

    {
      key: "dateFrom",
      label: "From",
      type: "date" as const,
    },

    {
      key: "dateTo",
      label: "To",
      type: "date" as const,
    },
  ];

  // 🔥 SORT HANDLER
  const handleSort = (
    field: "patient" | "doctor" | "date"
  ) => {

    if (sortField === field) {
      setSortDirection(prev =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 🔥 LOAD DATA
  const load = async () => {
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

      // 🔥 PATIENT MAP
      const patientIds = [
        ...new Set(list.map((a: any) => a.patientId))
      ] as (number | string)[];

      const patients = await getPatientsByIds(patientIds);

      const pMap: Record<number, string> = {};

      patients.forEach((p: any) => {
        pMap[p.id] = p.name;
      });

      setPatientMap(pMap);

      // 🔥 DOCTOR MAP
      const doctors = await getDoctors();

      const dMap: Record<number, string> = {};

      doctors.forEach((d: any) => {
        dMap[d.id] = d.name;
      });

      setDoctorMap(dMap);

      // 🔥 SORT
      let sorted = [...list];

      sorted.sort((a: any, b: any) => {

        let valA: any;
        let valB: any;

        // 🔥 PATIENT SORT
        if (sortField === "patient") {

          valA = pMap[a.patientId] || "";
          valB = pMap[b.patientId] || "";

        }

        // 🔥 DOCTOR SORT
        else if (sortField === "doctor") {

          valA = dMap[a.doctorId] || "";
          valB = dMap[b.doctorId] || "";

        }

        // 🔥 DATE SORT
        else {

          valA = new Date(
            a.dateTime || a.appointmentDate
          ).getTime();

          valB = new Date(
            b.dateTime || b.appointmentDate
          ).getTime();
        }

        // 🔥 STRING SORT
        if (typeof valA === "string") {

          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        // 🔥 NUMBER SORT
        return sortDirection === "asc"
          ? valA - valB
          : valB - valA;
      });

      // 🔥 SEARCH
      let filtered = sorted;

      if (query) {

        filtered = filtered.filter((a: any) =>
          (pMap[a.patientId] || "")
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      }

      // 🔥 STATUS FILTER
      if (filters.status) {

        filtered = filtered.filter(
          (a: any) => a.status === filters.status
        );
      }

      // 🔥 DATE FROM
      if (filters.dateFrom) {

        filtered = filtered.filter(
          (a: any) =>
            new Date(a.dateTime) >=
            new Date(filters.dateFrom)
        );
      }

      // 🔥 DATE TO
      if (filters.dateTo) {

        filtered = filtered.filter(
          (a: any) =>
            new Date(a.dateTime) <=
            new Date(filters.dateTo)
        );
      }

      setAppointments(filtered);

      setTotalAppointments(
        data.totalElements || 0
      );

    } catch (err) {

      console.error(err);

      setAppointments([]);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [
    page,
    query,
    filters,
    sortField,
    sortDirection
  ]);

  // 🔥 STATUS UPDATE
  const updateStatus = async (
    id: number,
    status: string
  ) => {

    try {

      await updateAppointmentStatus(id, status);

      toast.success(`Updated to ${status}`);

      load();

    } catch {

      toast.error("Update failed");
    }
  };

  return (
    <ReceptionistLayout>

      {/* HEADER */}
      <div className="mb-6 flex justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Appointments
          </h1>

          <p className="text-sm text-gray-500">
            Receptionist control panel
          </p>
        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-4 flex gap-3 flex-wrap">

        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search patient..."
        />

        <FilterBar
          filters={appointmentFilters}
          values={filters}
          onChange={(key, value) =>
            setFilters(prev => ({
              ...prev,
              [key]: value,
            }))
          }
        />

      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-50 dark:bg-gray-700">

            <tr>

              {/* PATIENT */}
              <th
                onClick={() => handleSort("patient")}
                className="p-3 text-left cursor-pointer select-none"
              >
                Patient{" "}
                {sortField === "patient" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : "↓")}
              </th>

              {/* DOCTOR */}
              <th
                onClick={() => handleSort("doctor")}
                className="p-3 text-left cursor-pointer select-none"
              >
                Doctor{" "}
                {sortField === "doctor" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : "↓")}
              </th>

              {/* DATE */}
              <th
                onClick={() => handleSort("date")}
                className="p-3 text-left cursor-pointer select-none"
              >
                Date{" "}
                {sortField === "date" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : "↓")}
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              Array.from({ length: pageSize }).map((_, i) => (

                <tr key={i}>

                  <td colSpan={5} className="p-4">
                    <Skeleton className="h-6 w-full" />
                  </td>

                </tr>
              ))

            ) : appointments.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-6 text-center"
                >
                  No appointments
                </td>

              </tr>

            ) : (

              appointments.map((a) => (

                <tr
                  key={a.id}
                  className="border-t"
                >

                  {/* PATIENT */}
                  <td className="p-3">
                    {patientMap[a.patientId] ||
                      `#${a.patientId}`}
                  </td>

                  {/* DOCTOR */}
                  <td className="p-3">
                    {doctorMap[a.doctorId] ||
                      `#${a.doctorId}`}
                  </td>

                  {/* DATE */}
                  <td className="p-3">
                    {new Date(
                      a.dateTime ||
                      a.appointmentDate
                    ).toLocaleString()}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <StatusBadge status={a.status} />
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2">

                    {a.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(
                              a.id,
                              "CONFIRMED"
                            )
                          }
                          className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              a.id,
                              "CANCELLED"
                            )
                          }
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {a.status === "CONFIRMED" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            a.id,
                            "COMPLETED"
                          )
                        }
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Complete
                      </button>
                    )}

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

    </ReceptionistLayout>
  );
}