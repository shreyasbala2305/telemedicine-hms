import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  createDoctor,
  getDoctor,
  updateDoctor,
  Doctor,
} from "../../../services/doctorService";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function DoctorEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Doctor>({
    name: '',
    email: '',
    contact: '',
    speciality: '',
    qualification: '',
    availability: [],
    userId: '',
  });

  // 🔥 LOAD DOCTOR
  useEffect(() => {
    if (id && id !== "new") {
      (async () => {
        try {
          const d = await getDoctor(Number(id));

          if (!d) {
            toast.error("Doctor not found");
            navigate("/admin/doctors");
            return;
          }

          setForm({
            name: d.name || "",
            email: d.email || "",
            contact: d.contact || "",
            speciality: d.speciality || "",
            qualification: d.qualification || "",
            availability: d.availability || [],
            userId: d.userId || "",
          });
        } catch (err) {
          console.error(err);
          toast.error("Failed to load doctor");
          navigate("/admin/doctors");
        }
      })();
    }
  }, [id]);

  const handleChange = (k: keyof Doctor, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // 🔥 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        availability: form.availability || [],
      };

      if (id && id !== "new") {
        await updateDoctor(Number(id), payload);
        toast.success("Doctor updated");
      } else {
        await createDoctor(payload); // 🔥 backend will create user automatically
        toast.success("Doctor created");
      }

      navigate("/admin/doctors");
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">
        {id && id !== "new" ? "Edit Doctor" : "New Doctor"}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm">Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              type="email"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Contact</label>
            <input
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Speciality</label>
            <input
              value={form.speciality}
              onChange={(e) => handleChange("speciality", e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Qualification</label>
            <input
              value={form.qualification}
              onChange={(e) => handleChange("qualification", e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* 🔥 Availability handled separately */}
          <div>
            <label className="block text-sm mb-2">Availability</label>

            <button
              type="button"
              onClick={() => navigate(`/admin/doctors/${id}/availability`)}
              className="px-4 py-2 border rounded"
            >
              Manage Availability
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}