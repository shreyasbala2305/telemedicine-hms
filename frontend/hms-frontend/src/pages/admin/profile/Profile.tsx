import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const { token } = useAuth();

  const getUserFromToken = () => {
    if (!token) return { name: "", email: "" };
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        name: payload.name || payload.fullName || "",
        email: payload.sub || payload.email || ""
      };
    } catch {
      return { name: "", email: "" };
    }
  };

  const user = getUserFromToken();

  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    contact: "",
  });

  const handleChange = (k: string, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    try {
      // 🔥 call update API here later
      toast.success("Profile updated");
      setEdit(false);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>

          <button
            onClick={() => setEdit(!edit)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {edit ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-6">

          {/* AVATAR */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              {form.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-lg">{form.name}</p>
              <p className="text-gray-500 text-sm">{form.email}</p>
            </div>
          </div>

          {/* FORM */}
          <div className="grid gap-4">

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                value={form.name}
                disabled={!edit}
                onChange={e => handleChange("name", e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded dark:bg-gray-700"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                value={form.email}
                disabled
                className="w-full mt-1 px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700"
              />
            </div>

            {/* CONTACT */}
            <div>
              <label className="text-sm text-gray-500">Contact</label>
              <input
                value={form.contact}
                disabled={!edit}
                onChange={e => handleChange("contact", e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded dark:bg-gray-700"
              />
            </div>

          </div>

          {/* ACTION */}
          {edit && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}