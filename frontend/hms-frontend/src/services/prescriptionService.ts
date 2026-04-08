// src/services/prescriptionService.ts
import api from "./api";
import { MOCK_MODE } from "../config";

export interface Medicine {
  name: string;
  dose: string; // "1 tablet"
  frequency: string; // "2x/day"
  duration: string; // "5 days"
}

export interface PrescriptionPayload {
  appointmentId?: number;
  patientId: string | number;
  doctorId: string | number;
  symptoms?: string;
  diagnosis?: string;
  medicines: Medicine[];
  followUpDate?: string; // ISO
  notes?: string;
}

const base = "/prescription-service/prescriptions";

export const createPrescription = async (payload: PrescriptionPayload) => {
  if (MOCK_MODE) {
    return new Promise(resolve => setTimeout(() => resolve({ id: Math.floor(Math.random()*10000), ...payload }), 600));
  }
  const res = await api.post(base, payload);
  return res.data;
};

export const getPrescriptionsByPatient = async (patientId: string | number) => {
  if (MOCK_MODE) {
    return Promise.resolve([
      { id: 101, patientId, doctorId: 11, symptoms: "Fever", diagnosis: "Viral fever", medicines: [{ name: "Paracetamol", dose: "500mg", frequency: "3x/day", duration: "5 days" }], followUpDate: "2025-10-01", notes: "Rest" },
    ]);
  }
  const res = await api.get(`${base}/patient/${patientId}`);
  return res.data;
};

export const getPrescriptionsByDoctor = async (doctorId: string | number) => {
  if (MOCK_MODE) {
    return Promise.resolve([
      { id: 201, patientId: 9, doctorId, symptoms: "Cough", diagnosis: "Bronchitis", medicines: [{ name: "Cough Syrup", dose: "10ml", frequency: "2x/day", duration: "7 days" }], followUpDate: "2025-10-07", notes: "" },
    ]);
  }
  const res = await api.get(`${base}/doctor/${doctorId}`);
  return res.data;
};

export const getPrescription = async (id: number) => {
  if (MOCK_MODE) {
    return Promise.resolve({ id, patientId: 9, doctorId: 11, symptoms: "Fever", diagnosis: "Viral", medicines: [{ name: "Med A", dose: "1", frequency: "1x", duration: "3 days" }], notes: "" });
  }
  const res = await api.get(`${base}/${id}`);
  return res.data;
};
