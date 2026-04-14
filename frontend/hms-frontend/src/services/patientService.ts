// src/services/patientService.ts
import api from './api';
import { MOCK_MODE } from '../config';

export interface Patient {
  id?: number;
  name: string;
  email: string;
  dob?: string; // ISO date
  gender?: string;
  contact?: string;
  userId?: string;
}

const base = '/patient-service/patients';

export const getPatients = async (): Promise<Patient[]> => {
  if (MOCK_MODE) {
    return Promise.resolve([
      { id: 9, name: 'Jane Doe', email: 'jane@demo.com', dob: '1990-04-12', gender: 'F', contact: '9876543210', userId: 'user9' },
      { id: 10, name: 'John Smith', email: 'john@demo.com', dob: '1986-11-02', gender: 'M', contact: '9123456780', userId: 'user10' },
    ]);
  }
  const res = await api.get(`${base}?page=0&size=100`);
  return res.data.content || res.data;
};

export const getPatient = async (id: number): Promise<Patient> => {
  if (MOCK_MODE) {
    return Promise.resolve({ id, name: `Patient ${id}`, email: `p${id}@demo.com`, dob: '1990-01-01', gender: 'M', contact: '9000000000', userId: `user${id}` });
  }
  const res = await api.get(`${base}/${id}`);
  return res.data;
};

export const createPatient = async (payload: Patient) => {
  if (MOCK_MODE) {
    return Promise.resolve({ ...payload, id: Math.floor(Math.random() * 1000) });
  }
  const res = await api.post(`/patient-service/patients/register`, payload);
  return res.data;
};

export const updatePatient = async (id: number, payload: Patient) => {
  if (MOCK_MODE) {
    return Promise.resolve({ ...payload, id });
  }
  const res = await api.put(`${base}/${id}`, payload);
  return res.data;
};

export const deletePatient = async (id: number) => {
  if (MOCK_MODE) {
    return Promise.resolve({ success: true });
  }
  const res = await api.delete(`${base}/${id}`);
  return res.data;
};

// fetch multiple patient details by ids (parallel)
export const getPatientsByIds = async (ids: Array<string | number>) => {
  if (MOCK_MODE) {
    const all = await getPatients();
    return all.filter(p => ids.includes(String(p.id)));
  }
  // try bulk endpoint if available (not assumed). Fallback to individual fetches.
  const calls = ids.map(id => api.get(`${base}/${id}`).then(r => r.data).catch(() => null));
  const results = await Promise.all(calls);
  return results.filter(Boolean);
};

export async function getPatientsPaged(params: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", String(params.page-1));
  if (params.pageSize) query.append("pageSize", String(params.pageSize));

  const res = await api.get(`/patient-service/patients?${query.toString()}`);
  return {
    data: res.data.content,
    total: res.data.totalElements
  };
}
