import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

/* AUTH */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/misc/Unauthorized";

/* ROUTE GROUPS */
import AdminRoutes from "./routes/AdminRoutes";
import ReceptionistRoutes from "./routes/ReceptionistRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";
import PatientRoutes from "./routes/PatientRoutes";

export default function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* ================= RECEPTIONIST ================= */}
      <Route
        path="/receptionist/*"
        element={
          <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
            <ReceptionistRoutes />
          </ProtectedRoute>
        }
      />

      {/* ================= DOCTOR ================= */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={["DOCTOR"]}>
            <DoctorRoutes />
          </ProtectedRoute>
        }
      />

      {/* ================= PATIENT ================= */}
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute allowedRoles={["PATIENT"]}>
            <PatientRoutes />
          </ProtectedRoute>
        }
      />

      {/* ================= DEFAULT ================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-8">Page not found</div>} />

    </Routes>
  );
}