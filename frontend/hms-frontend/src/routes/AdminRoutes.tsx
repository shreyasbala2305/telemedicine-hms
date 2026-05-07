import { Routes, Route } from "react-router-dom";

/* DASHBOARD */
import AdminDashboard from "../pages/admin/dashboard/Dashboard";
import AdminProfile from "../pages/admin/profile/Profile";

/* PATIENTS */
import PatientList from "../pages/admin/patients/List";
import PatientEdit from "../pages/admin/patients/Edit";

/* DOCTORS */
import DoctorList from "../pages/admin/doctors/List";
import DoctorEdit from "../pages/admin/doctors/Edit";
import DoctorDetail from "../pages/admin/doctors/Detail";

/* APPOINTMENTS */
import AppointmentList from "../pages/admin/appointments/List";
// (optional if you create later)
// import AppointmentDetail from "../pages/admin/appointments/Detail";

/* RECEPTIONISTS */
import ReceptionistList from "../pages/admin/receptionist/List";
import ReceptionistNew from "../pages/admin/receptionist/New";
import AdminPatientDetail from "../pages/admin/patients/Detail";
import DoctorAvailabilityPage from "../pages/doctor/Availability";
import AdminDoctorAvailability from "../pages/admin/doctors/Availability";
import AppointmentDetail from "../pages/admin/appointments/Detail";
import AdminAppointmentDetail from "../pages/admin/appointments/Detail";

export default function AdminRoutes() {
  return (
    <Routes>

      {/* ================= DASHBOARD ================= */}
      <Route path="/" element={<AdminDashboard />} />
      <Route path="profile" element={<AdminProfile />} />

      {/* ================= PATIENTS ================= */}
      <Route path="patients" element={<PatientList />} />
      <Route path="patients/:id" element={<AdminPatientDetail />} />
      <Route path="patients/:id/edit" element={<PatientEdit />} />

      {/* ================= DOCTORS ================= */}
      <Route path="doctors" element={<DoctorList />} />
      <Route path="doctors/new" element={<DoctorEdit />} />
      <Route path="doctors/:id/edit" element={<DoctorEdit />} />
      <Route path="doctors/:id" element={<DoctorDetail />} />
      <Route path="doctors/:id/availability" element={<AdminDoctorAvailability />} />

      {/* ================= APPOINTMENTS ================= */}
      <Route path="appointments" element={<AppointmentList />} />
      <Route path="appointments/:id" element={<AdminAppointmentDetail />} />
      {/* Future */}
      {/* <Route path="appointments/:id" element={<AppointmentDetail />} /> */}

      {/* ================= RECEPTIONISTS ================= */}
      <Route path="receptionists" element={<ReceptionistList />} />
      <Route path="receptionists/new" element={<ReceptionistNew />} />

    </Routes>
  );
}