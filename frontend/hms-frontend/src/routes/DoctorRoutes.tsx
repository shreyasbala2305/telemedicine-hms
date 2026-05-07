import { Routes, Route } from "react-router-dom";
import DoctorAppointments from "../pages/doctor/appointments/List";
import DoctorDashboard from "../pages/doctor/dashboard/Dashboard";
import DoctorPatientDetail from "../pages/doctor/patients/Detail";
import DoctorPatients from "../pages/doctor/patients/List";
import DoctorPrescriptions from "../pages/doctor/prescriptions/List";
import DoctorPrescriptionNew from "../pages/doctor/prescriptions/New";
import DoctorAvailabilityPage from "../pages/doctor/Availability";
import DoctorPrescriptionDetail from "../pages/doctor/prescriptions/Detail";
import DoctorAppointmentDetail from "../pages/doctor/appointments/Detail";
import DoctorProfile from "../pages/doctor/profile/Profile";

export default function DoctorRoutes() {
    return (
        <Routes>
              <Route path="/" element={<DoctorDashboard />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="appointments/:id" element={<DoctorAppointmentDetail />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="patients/:id" element={<DoctorPatientDetail />} />
              <Route path="prescriptions" element={<DoctorPrescriptions />} />
              <Route path="prescriptions/new" element={<DoctorPrescriptionNew />} />
              <Route path="prescriptions/:id" element={<DoctorPrescriptionDetail />} />
              <Route path="availability" element={<DoctorAvailabilityPage />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Routes>
    );
}