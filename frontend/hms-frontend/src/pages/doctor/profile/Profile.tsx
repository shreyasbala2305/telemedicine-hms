import { useState } from "react";
import DoctorLayout from "../../../layouts/DoctorLayout";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

export default function DoctorProfile() {
  const { token } = useAuth();

  const getUser = () => {
    if (!token) return { name: "", email: "" };
    try {
      const p = JSON.parse(atob(token.split(".")[1]));
      return {
        name: p.name || p.fullName || "",
        email: p.sub || "",
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
    speciality: "",
  });

  const handleChange = (k: string, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const save = () => {
    toast.success("Profile updated");
    setEdit(false);
  };

  return (
    <DoctorLayout>
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button
            onClick={() => setEdit(!edit)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {edit ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">

          <div>
            <label>Name</label>
            <input
              value={form.name}
              disabled={!edit}
              onChange={e => handleChange("name", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Email</label>
            <input value={form.email} disabled className="w-full border p-2 rounded bg-gray-100" />
          </div>

          <div>
            <label>Contact</label>
            <input
              value={form.contact}
              disabled={!edit}
              onChange={e => handleChange("contact", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Speciality</label>
            <input
              value={form.speciality}
              disabled={!edit}
              onChange={e => handleChange("speciality", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {edit && (
            <button
              onClick={save}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}