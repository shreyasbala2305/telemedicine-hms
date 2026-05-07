import React, { useState } from "react";
import { createPatient } from "../../../services/patientService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReceptionistLayout from "../../../layouts/ReceptionistLayout";

export default function ReceptionistPatientNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    gender: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (k: string, v: any) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      // ✅ CALL API ONLY HERE
      const created = await createPatient(form);

      toast.success("Patient created");

      // ✅ redirect with ID
      navigate(`/receptionist/appointments/new?patientId=${created.id}`);
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReceptionistLayout>
      <h1 className="text-2xl font-bold mb-6">Add Patient</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-xl">
        <form onSubmit={submit} className="space-y-4">

          <input
            placeholder="Name"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => handleChange("email", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            placeholder="Contact"
            value={form.contact}
            onChange={e => handleChange("contact", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="DOB"
            type="date"
            value={form.dob}
            onChange={e => handleChange("dob", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={form.gender}
            onChange={e => handleChange("gender", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </form>
      </div>
    </ReceptionistLayout>
  );
}