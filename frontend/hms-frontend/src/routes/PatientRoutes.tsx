import { Routes, Route } from "react-router-dom";
import PatientAppointments from "../pages/patient/Appointments";
import BookDoctor from "../pages/patient/book/BookDoctor";
import BookList from "../pages/patient/book/List";
import PatientDoctorProfile from "../pages/patient/PatientDoctorProfile";
import PatientDoctorSearch from "../pages/patient/PatientDoctorSearch";
import PatientPrescriptions from "../pages/patient/PatientPresciptions";
import PatientPrescriptionDetail from "../pages/patient/prescriptions/Detail";
import PatientProfile from "../pages/patient/profile/Profile";
import PatientDashboard from "../pages/patient/dashboard/Dashboard";

export default function PatientRoutes() {
    return(
        <Routes>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="doctors" element={<PatientDoctorSearch />} />
              <Route path="doctors/:id" element={<PatientDoctorProfile />} />
              <Route path="book" element={<BookList />} />
              <Route path="book/:doctorId" element={<BookDoctor />} />
              <Route path="prescriptions" element={<PatientPrescriptions />} />
              <Route path="prescriptions/:id" element={<PatientPrescriptionDetail />} />
            </Routes>
    );
}