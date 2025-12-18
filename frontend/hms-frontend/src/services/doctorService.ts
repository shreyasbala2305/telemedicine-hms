// src/services/doctorService.ts
import api from './api';
import { MOCK_MODE } from '../config';

export interface Doctor {
  id?: number;
  name: string;
  email: string;
  contact?: string;
  speciality?: string;
  qualification?: string;
  availability?: string; // e.g. "Mon-Fri 9-5"
}

const base = '/doctor-service/doctors';

export const getDoctors = async (): Promise<Doctor[]> => {
  if (MOCK_MODE) {
    return Promise.resolve([
      { id: 11, name: 'Dr. A', email: 'a@hospital.com', speciality: 'Cardiology', contact: '9000000001', qualification: 'MD' },
      { id: 12, name: 'Dr. B', email: 'b@hospital.com', speciality: 'Orthopedic', contact: '9000000002', qualification: 'MS' },
    ]);
  }
  const res = await api.get(`${base}`);
  return res.data;
};

export const getDoctor = async (id: number): Promise<Doctor> => {
  if (MOCK_MODE) {
    return Promise.resolve({ id, name: `Dr ${id}`, email: `doc${id}@demo.com`, speciality: 'General', contact: '9000000000', qualification: 'MBBS' });
  }
  const res = await api.get(`${base}/${id}`);
  return res.data;
};

export const createDoctor = async (payload: Doctor) => {
  if (MOCK_MODE) {
    return Promise.resolve({ ...payload, id: Math.floor(Math.random() * 1000) });
  }
  const res = await api.post(`${base}`, payload);
  return res.data;
};

export const updateDoctor = async (id: number, payload: Doctor) => {
  if (MOCK_MODE) {
    return Promise.resolve({ ...payload, id });
  }
  const res = await api.put(`${base}/${id}`, payload);
  return res.data;
};

export const deleteDoctor = async (id: number) => {
  if (MOCK_MODE) {
    return Promise.resolve({ success: true });
  }
  const res = await api.delete(`${base}/${id}`);
  return res.data;
};

export async function getDoctorsPaged(params: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", String(params.page));
  if (params.pageSize) query.append("pageSize", String(params.pageSize));

  const res = await api.get(`/doctor-service/doctors?${query.toString()}`);
  return res.data;
}
