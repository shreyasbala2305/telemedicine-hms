// src/pages/admin/patients/Edit.tsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { createPatient, getPatient, updatePatient, Patient } from '../../../services/patientService';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function PatientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Patient>({ name: '', email: '', dob: '', gender: '', contact: '', userId: '' });

  useEffect(() => {
    if (id && id !== 'new') {
      (async () => {
        const p = await getPatient(Number(id));
        setForm(p);
      })();
    }
  }, [id]);

  const handleChange = (k: keyof Patient, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id && id !== 'new') {
        await updatePatient(Number(id), form);
        toast.success('Patient updated');
      } else {
        await createPatient(form);
        toast.success('Patient created');
      }
      navigate('/admin/patients');
    } catch {
      toast.error('Save failed');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{id && id !== 'new' ? 'Edit Patient' : 'New Patient'}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Full Name</label>
            <input value={form.name} onChange={e => handleChange('name', e.target.value)} className="w-full px-4 py-2 dark:bg-gray-800 border rounded" required />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={form.email} onChange={e => handleChange('email', e.target.value)} type="email" className="w-full px-4 py-2 dark:bg-gray-800 border rounded" required />
          </div>
          <div>
            <label className="block text-sm">DOB</label>
            <input value={form.dob?.split('T')[0] ?? ''} onChange={e => handleChange('dob', e.target.value)} type="date" className="w-full px-4 py-2 dark:bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Gender</label>
            <input value={form.gender} onChange={e => handleChange('gender', e.target.value)} className="w-full px-4 py-2 dark:bg-gray-800 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Contact</label>
            <input value={form.contact} onChange={e => handleChange('contact', e.target.value)} className="w-full px-4 py-2 dark:bg-gray-800 border rounded" />
          </div>
          {/* <div>
            <label className="block text-sm">User ID</label>
            <input value={form.userId} onChange={e => handleChange('userId', e.target.value)} className="w-full px-4 py-2 dark:bg-gray-800 border rounded" />
          </div> */}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate('/admin/patients')}>Cancel</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
