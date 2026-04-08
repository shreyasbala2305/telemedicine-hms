import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import PatientsList from "./pages/admin/patients/List";
import PatientEdit from "./pages/admin/patients/Edit";
import DoctorsList from "./pages/admin/doctors/List";
import DoctorEdit from "./pages/admin/doctors/Edit";
import AppointmentsList from "./pages/admin/appointments/List";
import AppointmentNew from "./pages/admin/appointments/New";
import ProtectedRoute from "./routes/ProtectedRoute";
import Unauthorized from "./pages/misc/Unauthorized";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorAppointmentDetail from "./pages/doctor/AppointmentDetail";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorPatientDetail from "./pages/doctor/PatientDetail";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientAppointments from "./pages/patient/Appointments";
import PatientProfile from "./pages/patient/Profile";
import BookList from "./pages/patient/book/List";
import BookDoctor from "./pages/patient/book/BookDoctor";
import DoctorPrescriptions from "./pages/doctor/prescriptions/List";
import DoctorPrescriptionNew from "./pages/doctor/prescriptions/New";
import DoctorPrescriptionDetail from "./pages/doctor/prescriptions/Detail";
import PatientPrescriptions from "./pages/patient/prescriptions/List";
import PatientPrescriptionDetail from "./pages/patient/prescriptions/Detail";
import AdminDoctorAvailability from "./pages/admin/doctors/Availability";
import DoctorAvailabilityPage from "./pages/doctor/Availability";
import { ThemeProvider } from "./context/ThemeContext";


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <PatientsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients/new"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <PatientEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <PatientEdit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DoctorsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/new"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DoctorEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DoctorEdit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AppointmentsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments/new"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AppointmentNew />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor"
        element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <DoctorDashboard />
            </ProtectedRoute>
        }
        />
        <Route
        path="/doctor/dashboard"
        element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <DoctorDashboard />
            </ProtectedRoute>
        }
        />
        <Route
        path="/doctor/appointments"
        element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <DoctorAppointments />
            </ProtectedRoute>
        }
        />
        <Route
        path="/doctor/appointments/:id"
        element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <DoctorAppointmentDetail />
            </ProtectedRoute>
        }
        />
        <Route
        path="/doctor/patients"
        element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <DoctorPatients />
            </ProtectedRoute>
        }
        />
        <Route
        path="/doctor/patients/:id"
        element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <DoctorPatientDetail />
            </ProtectedRoute>
        }
        />

        {/* Patient routes */}
        <Route
        path="/patient"
        element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
            <PatientDashboard />
            </ProtectedRoute>
        }
        />
        <Route
        path="/patient/dashboard"
        element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
            <PatientDashboard />
            </ProtectedRoute>
        }
        />
        <Route
        path="/patient/appointments"
        element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
            <PatientAppointments />
            </ProtectedRoute>
        }
        />
        <Route
        path="/patient/profile"
        element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
            <PatientProfile />
            </ProtectedRoute>
        }
        />
        <Route
          path="/patient/book"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <BookList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book/:doctorId"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <BookDoctor />
            </ProtectedRoute>
          }
        />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-8">Page not found</div>} />
      {/* Doctor prescriptions */}
      <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorPrescriptions /></ProtectedRoute>} />
      <Route path="/doctor/prescriptions/new" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorPrescriptionNew /></ProtectedRoute>} />
      <Route path="/doctor/prescriptions/:id" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorPrescriptionDetail /></ProtectedRoute>} />

      { /*Patient prescriptions */}
      <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientPrescriptions /></ProtectedRoute>} />
      <Route path="/patient/prescriptions/:id" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientPrescriptionDetail /></ProtectedRoute>} />

      { /*Availability*/ }
      <Route path="/admin/doctors/:id/availability" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDoctorAvailability /></ProtectedRoute>} />
      <Route path="/doctor/availability" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorAvailabilityPage /></ProtectedRoute>} />

      {/* 404 LAST */}
      <Route path="*" element={<div className="p-8">Page not found</div>} />
    </Routes>
  );
}
