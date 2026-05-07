import api from "./api";

export const getVitals = async (patientId: number) => {
  const res = await api.get(`/ehr-service/ehr/vitals/patient/${patientId}`);
  return res.data;
};

export const createVital = async (data: any) => {
  const res = await api.post(`/ehr-service/ehr/vitals`, data);
  return res.data;
};

export const getRecords = async (patientId: number) => {
  const res = await api.get(`/ehr-service/ehr/records/patient/${patientId}`);
  return res.data;
};

export const createRecord = async (data: any) => {
  const res = await api.post(`/ehr-service/ehr/records`, data);
  return res.data;
};