import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getUsersByRole } from "../../../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ReceptionistList() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsersByRole("RECEPTIONIST");
      setData(res || []);
      setFiltered(res || []);
    } catch {
      toast.error("Failed to load receptionists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🔍 SEARCH
  useEffect(() => {
    if (!search) {
      setFiltered(data);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        data.filter(
          r =>
            r.name?.toLowerCase().includes(s) ||
            r.email?.toLowerCase().includes(s)
        )
      );
    }
  }, [search, data]);

  // 🔥 ACTION (placeholder)
  const handleDelete = (id: number) => {
    // TODO: call delete API later
    toast.success("User removed (mock)");
    setData(prev => prev.filter(r => r.id !== id));
  };

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">Receptionists</h1>

        <div className="flex gap-3">
            <input
            placeholder="Search receptionist..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
            />

            <button
            onClick={() => navigate("/admin/receptionists/new")}
            className="bg-primary text-white px-4 py-2 rounded-lg"
            >
            + Add Receptionist
            </button>
        </div>

    </div>

      

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left text-sm">ID</th>
              <th className="p-3 text-left text-sm">Name</th>
              <th className="p-3 text-left text-sm">Email</th>
              <th className="p-3 text-left text-sm">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  {Array(4).fill(0).map((_, j) => (
                    <td key={j} className="p-3">
                      <div className="h-3 w-full max-w-[120px] bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No receptionists found
                </td>
              </tr>
            ) : (
              filtered.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">

                  <td className="p-3 text-sm">{r.id}</td>

                  <td className="p-3 text-sm font-medium">
                    {r.name || "—"}
                  </td>

                  <td className="p-3 text-sm">
                    {r.email}
                  </td>

                  <td className="p-3 text-sm">

                    <div className="flex gap-2">

                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>

                      {/* future */}
                      {/* <button className="text-yellow-600">Disable</button> */}

                    </div>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}