// src/services/appointmentService.ts
import api from './api';
import { MOCK_MODE } from '../config';

export interface AppointmentPayload {
  patientId: string;
  doctorId: string;
  appointmentDate: string; // ISO
  status: string; // CONFIRMED | CANCELLED | COMPLETED etc
  description?: string;
}

const base = '/appointment-service/appointments';

export const getAppointments = async () => {
  if (MOCK_MODE) {
    return Promise.resolve([
      { id: 1, patientId: '9', doctorId: '11', appointmentDate: '2025-09-14T10:45:00', status: 'CONFIRMED', description: 'General checkup' },
      { id: 2, patientId: '10', doctorId: '12', appointmentDate: '2025-09-15T11:00:00', status: 'SCHEDULED', description: 'Follow-up' },
    ]);
  }
  const res = await api.get(`${base}`);
  return res.data;
};

export const getAppointment = async (id: number) => {
  if (MOCK_MODE) {
    return Promise.resolve({ id, patientId: '9', doctorId: '11', appointmentDate: '2025-09-14T10:45:00', status: 'CONFIRMED', description: '' });
  }
  const res = await api.get(`${base}/${id}`);
  return res.data;
};

export const createAppointment = async (payload: AppointmentPayload) => {
  if (MOCK_MODE) {
    return Promise.resolve({ ...payload, id: Math.floor(Math.random() * 1000) });
  }
  const res = await api.post(`${base}`, payload);
  return res.data;
};

export const updateAppointment = async (id: number, payload: Partial<AppointmentPayload>) => {
  if (MOCK_MODE) {
    return Promise.resolve({ ...payload, id });
  }
  const res = await api.put(`${base}/${id}`, payload);
  return res.data;
};

export const deleteAppointment = async (id: number) => {
  if (MOCK_MODE) {
    return Promise.resolve({ success: true });
  }
  const res = await api.delete(`${base}/${id}`);
  return res.data;
};

// get appointments filtered by patient id (assumes backend supports query param ?patientId= or you fetch all and filter)
export const getAppointmentsByPatient = async (patientId: string | number) => {
  if (MOCK_MODE) {
    // reuse existing mock list and filter
    const list = await getAppointments();
    return list.filter((a: any) => String(a.patientId) === String(patientId));
  }

  // try backend query first (if supported)
  try {
    const res = await api.get(`${base}?patientId=${patientId}`);
    return res.data;
  } catch {
    // fallback: fetch all and filter client-side
    const res = await api.get(`${base}`);
    return res.data.filter((a: any) => String(a.patientId) === String(patientId));
  }
};

// get appointments filtered by doctor id (assumes backend supports query param ?doctorId= or you fetch all and filter)
export const getAppointmentsByDoctor = async (doctorId: string | number) => {
  if (MOCK_MODE) {
    // reuse existing mock list and filter
    const list = await getAppointments();
    return list.filter((a: any) => String(a.doctorId) === String(doctorId));
  }

  // try backend query first (if supported)
  try {
    const res = await api.get(`${base}?doctorId=${doctorId}`);
    return res.data;
  } catch {
    // fallback: fetch all and filter client-side
    const res = await api.get(`${base}`);
    return res.data.filter((a: any) => String(a.doctorId) === String(doctorId));
  }
};

export async function getAppointmentsPaged(params: {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", String(params.page));
  if (params.pageSize) query.append("pageSize", String(params.pageSize));
  if (params.status) query.append("status", params.status);
  if (params.dateFrom) query.append("dateFrom", params.dateFrom);
  if (params.dateTo) query.append("dateTo", params.dateTo);

  const res = await api.get(`/appointment-service/appointments?${query.toString()}`);
  return res.data;
}
