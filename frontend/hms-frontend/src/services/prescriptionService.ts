// src/services/prescriptionService.ts

import api from "./api";
import { MOCK_MODE } from "../config";

export interface Medicine {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id?: number;
  appointmentId?: number;

  patientId: string | number;
  doctorId: string | number;

  doctorName?: string;
  patientName?: string;

  symptoms?: string;
  diagnosis?: string;

  medicines: Medicine[];

  followUpDate?: string;
  notes?: string;

  createdAt?: string;
}

export interface PrescriptionPayload {
  appointmentId?: number;

  patientId: string | number;
  doctorId: string | number;

  symptoms?: string;
  diagnosis?: string;

  medicines: Medicine[];

  followUpDate?: string;
  notes?: string;
}

const base = "/prescription-service/prescriptions";


// ✅ CREATE
export const createPrescription = async (
  payload: PrescriptionPayload
): Promise<Prescription> => {

  if (MOCK_MODE) {
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            id: Math.floor(Math.random() * 10000),
            createdAt: new Date().toISOString(),
            ...payload,
          }),
        600
      )
    );
  }

  const res = await api.post(base, payload);

  return res.data;
};


// ✅ GET BY PATIENT
export const getPrescriptionsByPatient = async (
  patientId: string | number
): Promise<Prescription[]> => {

  if (MOCK_MODE) {
    return Promise.resolve<Prescription[]>([
      {
        id: 101,
        patientId,
        doctorId: 11,
        doctorName: "Dr. Raj Sharma",

        symptoms: "Fever",
        diagnosis: "Viral Fever",

        medicines: [
          {
            name: "Paracetamol",
            dose: "500mg",
            frequency: "3x/day",
            duration: "5 days",
          },
        ],

        followUpDate: "2026-05-01",
        notes: "Drink plenty of water",
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  const res = await api.get(`${base}/patient/${patientId}`);

  return res.data;
};


// ✅ GET BY DOCTOR
export const getPrescriptionsByDoctor = async (
  doctorId: string | number
): Promise<Prescription[]> => {

  if (MOCK_MODE) {
    return Promise.resolve<Prescription[]>([
      {
        id: 201,
        patientId: 9,
        patientName: "Rahul Patil",

        doctorId,
        doctorName: "Dr. Raj Sharma",

        symptoms: "Cough",
        diagnosis: "Bronchitis",

        medicines: [
          {
            name: "Cough Syrup",
            dose: "10ml",
            frequency: "2x/day",
            duration: "7 days",
          },
        ],

        followUpDate: "2026-05-07",
        notes: "Avoid cold drinks",
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  const res = await api.get(`${base}/doctor/${doctorId}`);

  return res.data;
};


// ✅ GET SINGLE PRESCRIPTION
export const getPrescription = async (
  id: number
): Promise<Prescription> => {

  if (MOCK_MODE) {
    return Promise.resolve<Prescription>({
      id,

      patientId: 9,
      patientName: "Rahul Patil",

      doctorId: 11,
      doctorName: "Dr. Raj Sharma",

      symptoms: "Fever",
      diagnosis: "Viral Fever",

      medicines: [
        {
          name: "Paracetamol",
          dose: "500mg",
          frequency: "3x/day",
          duration: "5 days",
        },
      ],

      notes: "Take proper rest",
      createdAt: new Date().toISOString(),
    });
  }

  const res = await api.get(`${base}/${id}`);

  return res.data;
};