// src/pages/admin/doctors/Edit.tsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { createDoctor, getDoctor, updateDoctor, Doctor } from '../../../services/doctorService';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DoctorEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Doctor>({ name: '', email: '', contact: '', speciality: '', qualification: '', availability: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      (async () => {
        const d = await getDoctor(Number(id));
        setForm(d);
      })();
    }
  }, [id]);

  const handleChange = (k: keyof Doctor, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id && id !== 'new') {
        await updateDoctor(Number(id), form);
        toast.success('Doctor updated');
      } else {
        await createDoctor(form);
        toast.success('Doctor created');
      }
      navigate('/admin/doctors');
    } catch {
      toast.error('Save failed');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{id && id !== 'new' ? 'Edit Doctor' : 'New Doctor'}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input value={form.name} onChange={e => handleChange('name', e.target.value)} className="w-full px-4 py-2 dark:bg-gray-800 border rounded" required />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={form.email} onChange={e => handleChange('email', e.target.value)} type="email" className="w-full px-4 py-2 dark:bg-gray-800 border rounded" required />
          </div>
          <div>
            <label className="block text-sm">Contact</label>
            <input value={form.contact} onChange={e => handleChange('contact', e.target.value)} className="w-full px-4 py-2 dark:bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Speciality</label>
            <input value={form.speciality} onChange={e => handleChange('speciality', e.target.value)} className="w-full px-4 py-2 dark:bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Qualification</label>
            <input value={form.qualification} onChange={e => handleChange('qualification', e.target.value)} className="w-full px-4 py-2 dark:bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Availability</label>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/doctors/${id}/availability`)}
                  className="px-4 py-2 border rounded"
                >
                  Manage Availability
                </button>
              </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate('/admin/doctors')}>Cancel</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
