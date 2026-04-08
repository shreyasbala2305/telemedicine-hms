// src/pages/admin/appointments/New.tsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { createAppointment } from '../../../services/appointmentService';
import { getPatients } from '../../../services/patientService';
import { getDoctors } from '../../../services/doctorService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AppointmentNew() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', appointmentDate: '', status: 'CONFIRMED', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setPatients(await getPatients());
      setDoctors(await getDoctors());
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // convert datetime-local to ISO if needed
      const payload = { ...form, appointmentDate: form.appointmentDate };
      await createAppointment(payload);
      toast.success('Appointment created');
      navigate('/admin/appointments');
    } catch {
      toast.error('Create failed');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">New Appointment</h1>
      <div className="bg-white rounded-2xl p-6 shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Patient</label>
            <select value={form.patientId} onChange={e => setForm(prev => ({ ...prev, patientId: e.target.value }))} className="w-full px-4 py-2 border rounded" required>
              <option value="">Select patient</option>
              {patients.map(p => <option key={p.id} value={String(p.id)}>{p.name} (#{p.id})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Doctor</label>
            <select value={form.doctorId} onChange={e => setForm(prev => ({ ...prev, doctorId: e.target.value }))} className="w-full px-4 py-2 border rounded" required>
              <option value="">Select doctor</option>
              {doctors.map(d => <option key={d.id} value={String(d.id)}>{d.name} — {d.speciality}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Date & Time</label>
            <input type="datetime-local" value={form.appointmentDate} onChange={e => setForm(prev => ({ ...prev, appointmentDate: e.target.value }))} className="w-full px-4 py-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-2 border rounded">
              <option>CONFIRMED</option>
              <option>SCHEDULED</option>
              <option>CANCELLED</option>
              <option>COMPLETED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <input value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border rounded" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded">{loading ? 'Creating...' : 'Create'}</button>
            <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate('/admin/appointments')}>Cancel</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
