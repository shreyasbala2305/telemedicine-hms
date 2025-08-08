import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/patients" element={<PatientPage />} />
        <Route path="/doctors" element={<DoctorPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/triage" element={<TriageAI />} />
      </Routes>
    </Router>
  );
}
