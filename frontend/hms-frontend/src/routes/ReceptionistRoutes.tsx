import { Routes, Route } from "react-router-dom";

import ReceptionistDashboard from "../pages/receptionist/dashboard/Dashboard";
import ReceptionistPatients from "../pages/receptionist/patients/List";
import ReceptionistAppointments from "../pages/receptionist/appointments/List";
import TodayQueue from "../pages/receptionist/dashboard/TodayQueue";
import ReceptionistAppointmentNew from "../pages/receptionist/appointments/New";
import ReceptionistPatientDetail from "../pages/receptionist/patients/Detail";
import ReceptionistPatientNew from "../pages/receptionist/patients/New";

export default function ReceptionistRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReceptionistDashboard />} />
      {/* PATIENTS */}
      <Route path="patients" element={<ReceptionistPatients />} />
      <Route path="patients/new" element={<ReceptionistPatientNew />} />
      <Route path="patients/:id" element={<ReceptionistPatientDetail />} />

      {/* APPOINTMENTS */}
      <Route path="appointments" element={<ReceptionistAppointments />} />
      <Route path="appointments/new" element={<ReceptionistAppointmentNew />} />

      {/* QUEUE */}
      <Route path="queue" element={<TodayQueue />} />
    </Routes>
  );
}