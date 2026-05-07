import { useState } from "react";
import PatientLayout from "../../../layouts/PatientLayout";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

export default function PatientProfile() {
  const { token } = useAuth();

  const getUser = () => {
    if (!token) return { name: "", email: "" };

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return {
        name: payload.name || payload.fullName || "",
        email: payload.sub || "",
      };
    } catch {
      return { name: "", email: "" };
    }
  };

  const user = getUser();

  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    contact: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
  });

  const handleChange = (k: string, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const save = () => {
    toast.success("Profile updated");
    setEdit(false);
  };

  return (
    <PatientLayout>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            My Profile
          </h1>

          <button
            onClick={() => setEdit(!edit)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {edit ? "Cancel" : "Edit"}
          </button>

        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-5">

          {/* Avatar */}
          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {form.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-lg">
                {form.name}
              </p>

              <p className="text-sm text-gray-500">
                {form.email}
              </p>
            </div>

          </div>

          {/* FORM */}
          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm">Full Name</label>
              <input
                value={form.name}
                disabled={!edit}
                onChange={e => handleChange("name", e.target.value)}
                className="w-full mt-1 border rounded p-2 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="text-sm">Email</label>
              <input
                value={form.email}
                disabled
                className="w-full mt-1 border rounded p-2 bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="text-sm">Contact</label>
              <input
                value={form.contact}
                disabled={!edit}
                onChange={e => handleChange("contact", e.target.value)}
                className="w-full mt-1 border rounded p-2 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="text-sm">DOB</label>
              <input
                type="date"
                value={form.dob}
                disabled={!edit}
                onChange={e => handleChange("dob", e.target.value)}
                className="w-full mt-1 border rounded p-2 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="text-sm">Gender</label>
              <input
                value={form.gender}
                disabled={!edit}
                onChange={e => handleChange("gender", e.target.value)}
                className="w-full mt-1 border rounded p-2 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="text-sm">Blood Group</label>
              <input
                value={form.bloodGroup}
                disabled={!edit}
                onChange={e => handleChange("bloodGroup", e.target.value)}
                className="w-full mt-1 border rounded p-2 dark:bg-gray-700"
              />
            </div>

          </div>

          {/* ALLERGIES */}
          <div>
            <label className="text-sm">Allergies / Conditions</label>

            <textarea
              rows={4}
              value={form.allergies}
              disabled={!edit}
              onChange={e => handleChange("allergies", e.target.value)}
              className="w-full mt-1 border rounded p-2 dark:bg-gray-700"
            />
          </div>

          {/* ACTION */}
          {edit && (
            <div className="flex justify-end">
              <button
                onClick={save}
                className="bg-green-600 text-white px-5 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          )}

        </div>

      </div>

    </PatientLayout>
  );
}